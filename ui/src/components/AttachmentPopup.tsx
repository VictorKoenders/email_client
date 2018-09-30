import * as React from "react";

interface Props {
    current: server.Attachment | null;
}

interface State {
}

export var MODAL_ID = "attachment_modal";

export class AttachmentPopup extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
        };
    }

    static is_renderable_mime_type(mime_type: string) {
        return mime_type.startsWith("image/");
    }

    static is_text_mime_type(mime_type: string) {
        return mime_type.startsWith("text/") || mime_type.startsWith("multipart/");
    }

    render() {
        let attachment_name = "unknown";
        let attachment_content = null;
        if (this.props.current) {
            if (this.props.current.name) {
                attachment_name = this.props.current.name;
            }
            attachment_name += " (" + this.props.current.mime_type + ")";

            if (AttachmentPopup.is_renderable_mime_type(this.props.current.mime_type)) {
                var base64 = base64ArrayBuffer(this.props.current.contents);
                attachment_content = <img src={"data:" + this.props.current.mime_type + ";base64," + base64} />;
            }
            if (AttachmentPopup.is_text_mime_type(this.props.current.mime_type)) {
                attachment_content = <pre>
                    {String.fromCharCode.apply(null, this.props.current.contents)}
                </pre>;
            }
        }

        return <div className="modal fade bd-example-modal-lg" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id={MODAL_ID}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{
                            this.props.current
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
                        {this.props.current
                            ? <a href={"attachment/" + this.props.current.id} className="btn btn-default">Download</a>
                            : null
                        }
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
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