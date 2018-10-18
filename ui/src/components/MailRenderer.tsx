import * as React from "react";
import { Handler } from "../websocket";
import { AttachmentPopup, MODAL_ID as ATTACHMENT_MODAL_ID } from "./AttachmentPopup";
import { email_client } from "../protobuf_compiled";

interface State {
    show_html: boolean;
}

interface Props {
    email: email_client.ILoadEmailResponse;
    handler: Handler;
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

    select_attachment(attachment: email_client.AttachmentHeader, ev: React.MouseEvent<HTMLButtonElement>) {
        this.props.handler.load_attachment(attachment);
    }

    download_attachment(attachment: email_client.AttachmentHeader, ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        document.location!.href = "attachment/" + attachment.id;

        return false;
    }

    render_attachments() {
        if (this.props.email.attachments == null) return null;
        const attachments = [];
        for (const attachment of this.props.email.attachments) {
            const name = attachment.name || ("unknown " + attachment.mimeType);
            if (AttachmentPopup.is_renderable_mime_type(attachment.mimeType || "")) {
                attachments.push(
                    <button type="button" className="btn btn-secondary" key={attachment.id || ""}
                        onClick={this.select_attachment.bind(this, attachment)} data-toggle="modal" data-target={"#" + ATTACHMENT_MODAL_ID}>
                        {name}
                    </button>
                );
            } else {
                attachments.push(
                    <button type="button" className="btn btn-secondary" key={attachment.id || ""}
                        onClick={this.download_attachment.bind(this, attachment)}>
                        {name}
                    </button>
                );
            }
        }
        if (attachments.length > 0) {
            return <>
                <div className="btn-group" style={{ flexWrap: "wrap" }} role="group" aria-label="Attachments">
                    {attachments}
                </div>
                <br />
            </>;
        }
        return null;
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
            return <div dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody || "" }} />;
        } else {
            return (this.props.email.textPlainBody || "").split('\n').map((p, i) => <React.Fragment key={i}>{p}<br /></React.Fragment>);
        }
    }

    render() {
        return <div>
            <h2>{this.props.email.subject}</h2>
            {this.props.email.from} -&gt; {this.props.email.to}<br /><br />
            {this.render_attachments()}
            {this.props.email.htmlBody ? this.render_text_html_tabs() : null}
            {this.render_body()}
        </div>;
    }
}