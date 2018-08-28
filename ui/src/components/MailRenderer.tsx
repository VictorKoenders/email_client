import * as React from "react";
import { Handler } from "../websocket";

interface State {
    show_html: boolean;
}

interface Props {
    email: server.Email;
    handler: Handler;
    active_attachment: server.Attachment | null;
}

export class MailRenderer extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            show_html: false,
        };
    }

    set_show_html(show_html: boolean, ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({ show_html });

        return false;
    }

    select_attachment(attachment: server.AttachmentInfo, ev: React.MouseEvent<HTMLButtonElement>) {
        this.props.handler.load_attachment(attachment);
    }

    download_attachment(attachment: server.AttachmentInfo, ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        document.location.href = "/attachment/" + attachment.id;

        return false;
    }

    render_attachments() {
        const attachments = [];
        for (const attachment of this.props.email.attachments) {
            const name = attachment.name || ("unknown " + attachment.mime_type);
            if(this.is_renderable_mime_type(attachment.mime_type)) {
                attachments.push(
                    <button type="button" className="btn btn-secondary" key={attachment.id}
                        onClick={this.select_attachment.bind(this, attachment)} data-toggle="modal" data-target="#attachment_popup">
                        {name}
                    </button>
                );
            } else {
                attachments.push(
                    <button type="button" className="btn btn-secondary" key={attachment.id}
                        onClick={this.download_attachment.bind(this, attachment)}>
                        {name}
                    </button>
                );
            }
        }
        if (attachments.length > 0) {
            return <>
                <div className="btn-group" role="group" aria-label="Attachments">
                    {attachments}
                </div>
                <br />
            </>;
        }
        return null;
    }

    is_renderable_mime_type(mime_type: string) {
        return mime_type.startsWith("image/");
    }

    render_attachment() {
        return <b>Prview not implemented</b>;
    }

    render_attachment_modal() {
        let attachment_name = "unknown";
        let attachment_content = null;
        if (this.props.active_attachment) {
            if (this.props.active_attachment.name) {
                attachment_name = this.props.active_attachment.name;
            }
            attachment_name += " (" + this.props.active_attachment.mime_type + ")";

            if (this.is_renderable_mime_type(this.props.active_attachment.mime_type)) {
                var base64 = base64ArrayBuffer(this.props.active_attachment.contents);
                attachment_content = <img src={"data:" + this.props.active_attachment.mime_type + ";base64," + base64} />;
            }
        }

        return <div className="modal fade bd-example-modal-lg" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="attachment_popup">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{
                            this.props.active_attachment
                                ? attachment_name
                                : ""
                        }</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {attachment_content}
                    </div>
                    <div className="modal-footer">
                        {this.props.active_attachment
                            ? <a href={"/attachment/" + this.props.active_attachment.id} className="btn btn-default">Download</a>
                            : null
                        }
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    render_text_html_tabs() {
        return <ul className="nav nav-tabs">
            <li className="nav-item">
                <a className={"nav-link" + (this.state.show_html ? "" : " active")} href="#" onClick={this.set_show_html.bind(this, false)}>Plain text</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (this.state.show_html ? " active" : "")} href="#" onClick={this.set_show_html.bind(this, true)}>HTML</a>
            </li>
        </ul>
    }

    render_body() {
        if (this.state.show_html) {
            return <div dangerouslySetInnerHTML={{ __html: this.props.email.html_body || "" }} />;
        } else {
            return (this.props.email.text_plain_body || "").split('\n').map((p, i) => <React.Fragment key={i}>{p}<br /></React.Fragment>);
        }
    }

    render() {
        return <div>
            <h2>{this.props.email.subject}</h2>
            {this.props.email.from} -&gt; {this.props.email.to}<br /><br />
            {this.render_attachments()}
            {this.render_attachment_modal()}
            {this.props.email.html_body ? this.render_text_html_tabs() : null}
            {this.render_body()}
        </div>;
    }
}

function base64ArrayBuffer(arrayBuffer: number[]) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}