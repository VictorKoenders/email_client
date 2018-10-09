import { email_client } from "./protobuf_compiled";

interface HandlerListener {
    email_received(email: server.EmailInfo): void;
    email_loaded(email: server.Email): void;
    attachment_loaded(attachment: server.Attachment): void;
    inbox_loaded(address: server.Inbox, email: server.EmailInfo[]): void;
    setup(addresses: server.Inbox[]): void;
    authenticate_result(authenticated: boolean): void;
}

export class Handler {
    private socket: WebSocket | null;
    private reconnect_timeout: NodeJS.Timer | null;
    private handler: HandlerListener;
    private current_inbox: server.Inbox | null;

    constructor(handler: HandlerListener) {
        this.socket = null;
        this.reconnect_timeout = null;
        this.handler = handler;
        this.current_inbox = null;

        this.connect();
    }

    authenticate(username: string, password: string) {
        if (this.socket) {
            this.socket.send(email_client.ClientToServer.encode({
                authenticate: {
                    username,
                    password,
                }
            }).finish());
            this.socket.send(JSON.stringify({
                authenticate: {
                    username,
                    password
                }
            }));
        }
    }

    load_inbox(inbox: server.Inbox) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_inbox: inbox
            }));
        }
        this.current_inbox = inbox;
    }

    load_email(email: server.EmailInfo) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_email: email
            }));
        }
    }

    load_attachment(attachment: server.AttachmentInfo) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_attachment: attachment
            }));
        }
    }

    private connect() {
        this.socket = new WebSocket(
            (document.location.protocol === "https:" ? "wss://" : "ws://") +
            document.location.host +
            document.location.pathname +
            "ws/"
        );
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    }

    private onopen(ev: Event) {
    }

    private onclose(ev: CloseEvent) {
        this.socket = null;
        if (this.reconnect_timeout) {
            clearTimeout(this.reconnect_timeout);
        }
        this.reconnect_timeout = setTimeout(() => {
            this.connect();
        }, 5000);
        this.handler.authenticate_result(false);
    }

    private onerror(ev: Event) {
        console.error("[Websocket]", ev);
    }

    private onmessage(ev: MessageEvent) {
        let json: server.WebSocketMessage = JSON.parse(ev.data);
        if (json.init) {
            this.handler.setup(json.init);
            if (this.current_inbox) {
                this.load_inbox(this.current_inbox);
            }
        } else if (json.email_received) {
            this.handler.email_received(json.email_received);
        } else if (json.inbox_loaded) {
            this.handler.inbox_loaded(
                json.inbox_loaded.inbox_with_address,
                json.inbox_loaded.emails
            );
        } else if (json.email_loaded) {
            this.handler.email_loaded(
                json.email_loaded
            );
        } else if (json.attachment_loaded) {
            this.handler.attachment_loaded(
                json.attachment_loaded
            );
        } else if (json.authenticate_result === true || json.authenticate_result === false) {
            this.handler.authenticate_result(json.authenticate_result);
        } else {
            console.log("Unknown server message", json);
        }
    }
}