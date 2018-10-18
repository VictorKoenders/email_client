import * as React from "react";
import { email_client } from "../protobuf_compiled";

interface State {
    offset: number;
}

interface Props {
    inboxes: email_client.IInboxHeader[];
    emails: email_client.IEmailHeader[];
    active_inbox: email_client.ILoadInboxResponse | null;
    active_email: email_client.ILoadEmailResponse | null;
    onInboxSelected: (addr: email_client.IInboxHeader) => void;
    onEmailSelected: (email: email_client.IEmailHeader) => void;
}

export class Menu extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            offset: 0,
        };
    }

    back() {
        this.setState(state => ({
            offset: 0,
        }));
    }

    select_inbox(inbox: email_client.IInboxHeader, ev: React.MouseEvent<HTMLLIElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({
            offset: 1
        });

        this.props.onInboxSelected(inbox);

        return false;
    }

    select_email(email: email_client.IEmailHeader, ev: React.MouseEvent<HTMLLIElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.props.onEmailSelected(email);

        return false;
    }

    render_inbox(inbox: email_client.ILoadInboxResponse, index: number) {
        return <li key={index} onClick={this.select_inbox.bind(this, inbox)}
            className={this.props.active_inbox && this.props.active_inbox.id == inbox.id ? "active" : ""}>
            {inbox.unreadCount
                ? <b>{inbox.name} ({inbox.unreadCount})</b>
                : inbox.name
            }<br />
        </li>
    }

    render_email(email: email_client.ILoadEmailResponse, index: number) {
        return <li key={index} onClick={this.select_email.bind(this, email)}
            className={this.props.active_email && this.props.active_email.id == email.id ? "active" : ""}>
            {email.read
                ? email.from
                : <b>{email.from} *</b>}
            <br />
            {email.subject}
        </li>
    }

    render() {
        return <div className="sliding-row">
            <div style={{ left: (-this.state.offset * 100) + "%" }}>
                <ul className="box-list">
                    {this.props.inboxes.map(this.render_inbox.bind(this))}
                </ul>
            </div>
            <div style={{ left: (-this.state.offset * 100) + "%" }}>
                <div onClick={this.back.bind(this)} style={{ cursor: "pointer" }}>
                    &lt; Back
                </div>
                <ul className="box-list">
                    {this.props.emails.map(this.render_email.bind(this))}
                </ul>
            </div>
        </div>;
    }
}
