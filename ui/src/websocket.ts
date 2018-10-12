import { email_client } from "./protobuf_compiled";

interface HandlerListener {
    email_received(email: email_client.IEmailHeader): void;
    email_loaded(email: email_client.ILoadEmailResponse): void;
    attachment_loaded(attachment: email_client.ILoadAttachmentResponse): void;
    inbox_loaded(inbox: email_client.ILoadInboxResponse): void;
    setup(addresses: email_client.IInboxHeader[]): void;
    authenticate_result(authenticated: boolean): void;
}

export class Handler {
    private socket: WebSocket | null;
    private reconnect_timeout: NodeJS.Timer | null;
    private handler: HandlerListener;
    private current_inbox: email_client.IInboxHeader | null;
    private ping_timer: NodeJS.Timer | undefined;

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
        }
    }

    load_inbox(inbox: email_client.IInboxHeader) {
        if (this.socket) {
            this.socket.send(email_client.ClientToServer.encode({
                loadInbox: {
                    id: inbox.id
                }
            }).finish());
        }
        this.current_inbox = inbox;
    }

    load_email(email: email_client.IEmailHeader) {
        if (this.socket) {
            this.socket.send(email_client.ClientToServer.encode({
                loadEmail: {
                    id: email.id
                }
            }).finish());
        }
    }

    load_attachment(attachment: email_client.AttachmentHeader) {
        if (this.socket) {
            this.socket.send(email_client.ClientToServer.encode({
                loadAttachment: {
                    id: attachment.id
                }
            }).finish());
        }
    }

    private connect() {
        this.socket = new WebSocket(
            (document.location!.protocol === "https:" ? "wss://" : "ws://") +
            document.location!.host +
            document.location!.pathname +
            "ws/"
        );
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    }

    private onopen(ev: Event) {
        this.ping_timer = setInterval(() => {
            if (this.socket) this.socket.send(""); // ping
        }, 1000);
    }

    private onclose(ev: CloseEvent) {
        this.socket = null;
        if (this.ping_timer) {
            clearTimeout(this.ping_timer);
        }
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
        const data = ev.data;
        if (data instanceof Blob) {
            const reader = new FileReader()
            const self = this;
            reader.onload = function () {
                let buffer: Uint8Array;

                if (reader.result instanceof ArrayBuffer) {
                    buffer = new Uint8Array(reader.result);
                } else if (typeof reader.result == "string") {
                    let enc = new TextEncoder();
                    buffer = enc.encode(reader.result);
                } else {
                    // reader.result == null
                    return;
                }
                console.log(buffer);
                let message = email_client.ServerToClient.decode(buffer);
                if (message.authenticate != null) {
                    self.handler.authenticate_result(message.authenticate.success || false);
                    if (message.authenticate.success === true && message.authenticate.inboxes) {
                        self.handler.setup(message.authenticate.inboxes);
                    } else {
                        self.handler.setup([]);
                    }
                } else if (message.attachment != null) {
                    self.handler.attachment_loaded(message.attachment);
                } else if (message.inbox != null) {
                    console.log(message.inbox);
                    self.handler.inbox_loaded(message.inbox);
                } else {
                    console.log("Unknown message", message);
                }
            };
            reader.readAsText(data);
        }
        /*
        console.log(ev.data);
        var bytes = Array.prototype.slice.call(ev.data, 0, ev.data.size);
        console.log(bytes);
        let data = ev.data as Uint8Array;
        if (data != null) {
            let message = email_client.ServerToClient.decode(data);
            console.log(message);
        }
        /*return;
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
        }*/
    }
}