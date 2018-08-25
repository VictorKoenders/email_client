interface HandlerListener {
    email_received(email: server.Email): void;
    inbox_loaded(address: server.Address, email: server.Email[]): void;
    setup(addresses: server.Address[]): void;
    authenticate_result(authenticated: boolean): void;
}

export class Handler {
    private socket: WebSocket | null;
    private reconnect_timeout: NodeJS.Timer | null;
    private handler: HandlerListener;
    private current_inbox: server.Address | null;

    constructor(handler: HandlerListener) {
        this.socket = null;
        this.reconnect_timeout = null;
        this.handler = handler;
        this.current_inbox = null;

        this.connect();
    }

    authenticate(username: String, password: String) {
        if(this.socket) {
            this.socket.send(JSON.stringify({
                authenticate: {
                    username,
                    password
                }
            }));
        }
    }

    load_inbox(address: server.Address) {
        if(this.socket) {
            this.socket.send(JSON.stringify({
                load_inbox: address
            }));
        }
        this.current_inbox = address;
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
        if(this.reconnect_timeout){
            clearTimeout(this.reconnect_timeout);
        }
        this.reconnect_timeout = setTimeout(() => {
            this.connect();
        }, 5000);
    }

    private onerror(ev: Event) {
        console.error("[Websocket]", ev);
    }

    private onmessage(ev: MessageEvent) {
        let json = JSON.parse(ev.data);
        if(json.init) {
            this.handler.setup(json.init);
            if(this.current_inbox){
                this.load_inbox(this.current_inbox);
            }
        } else if(json.email_received) {
            this.handler.email_received(json.email_received);
        } else if(json.inbox_loaded) {
            this.handler.inbox_loaded(
                json.inbox_loaded.address,
                json.inbox_loaded.emails
            );
        } else if(json.hasOwnProperty('authenticate_result')) {
            this.handler.authenticate_result(json.authenticate_result);
        } else {
            console.log("Unknown server message", json);
        }
    }
}