import * as React from "react";
import { Menu } from "./Menu";
import { MailRenderer } from "./MailRenderer";
import { AttachmentPopup } from "./AttachmentPopup";
import { Handler } from "../websocket";
import { Login } from "./Login";

interface State {
    inboxes: server.Inbox[];
    emails: server.EmailInfo[];
    current_inbox: server.Inbox | null;
    current_email_info: server.EmailInfo | null;
    current_email: server.Email | null;
    current_attachment: server.Attachment | null;
    handler: Handler;
    authenticated: boolean;
    failed_login: boolean;
}

interface Props {
}

export class Root extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            inboxes: [
            ],
            emails: [],
            current_inbox: null,
            current_email_info: null,
            current_email: null,
            current_attachment: null,
            handler: new Handler(this),
            authenticated: false,
            failed_login: false,
        };
    }

    email_received(email: server.EmailInfo) {
        this.setState(state => {
            let emails = state.emails.slice();
            let inboxes = state.inboxes.slice();
            let current_inbox = state.current_inbox;

            let inbox = inboxes.find(a => a.id == email.inbox_id);
            if (inbox) {
                inbox.unread_count++;
            }
            if (current_inbox && current_inbox.id == email.inbox_id) {
                current_inbox.unread_count++;
                if (email.inbox_id == current_inbox.id) {
                    emails.splice(0, 0, email);
                }
            }
            return { emails, current_inbox, inboxes };
        });
    }

    inbox_loaded(inbox: server.Inbox, emails: server.Email[]) {
        this.setState(state => {
            if (state.current_inbox && state.current_inbox.name == inbox.name) {
                return { emails } as any;
            } else {
                return {};
            }
        });
    }

    attachment_loaded(attachment: server.Attachment) {
        this.setState({
            current_attachment: attachment
        });
    }
    email_loaded(email: server.Email) {
        this.setState(state => {
            if (state.current_email_info && state.current_email_info.id == email.id) {
                return { current_email: email } as any;
            } else {
                return {};
            }
        });
    }
    setup(inboxes: server.Inbox[]) {
        this.setState({ inboxes });
    }

    select_inbox(inbox: server.Inbox) {
        this.state.handler.load_inbox(inbox);
        this.setState({
            current_inbox: inbox
        });
    }

    select_email(email: server.EmailInfo) {
        if (!email.read) {
            email.read = true;
            if (this.state.current_inbox) {
                this.state.current_inbox.unread_count--;
            }
        }
        this.state.handler.load_email(email);
        this.setState({
            current_email_info: email,
            current_email: null,
        });
    }

    authenticate_result(authenticated: boolean) {
        this.setState({ authenticated, failed_login: authenticated === false });
    }

    authenticate(username: string, password: string) {
        this.state.handler.authenticate(username, password);
    }

    clear_failed_login() {
        this.setState({ failed_login: false });
    }

    render() {
        if (!this.state.authenticated) {
            return <Login
                onAuthenticate={this.authenticate.bind(this)}
                failed_login={this.state.failed_login}
                clear_failed_login={this.clear_failed_login.bind(this)}
            />;
        }
        return <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <Menu inboxes={this.state.inboxes}
                        emails={this.state.emails}
                        onInboxSelected={this.select_inbox.bind(this)}
                        onEmailSelected={this.select_email.bind(this)}
                        active_inbox={this.state.current_inbox}
                        active_email={this.state.current_email}
                    />
                </div>
                <div className="col-md-8">
                    {this.state.current_email ? <MailRenderer email={this.state.current_email} handler={this.state.handler} /> : null}
                </div>
                <AttachmentPopup current={this.state.current_attachment} />
            </div>
        </div>;
    }
}
