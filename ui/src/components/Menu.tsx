import * as React from "react";

interface State {
    offset: number;
}

interface Props {
    addresses: server.Address[];
    emails: server.Email[];
    active_address: server.Address | null;
    active_email: server.Email | null;
    onAddressSelected: (addr: server.Address) => void;
    onEmailSelected: (email: server.Email) => void;
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

    select_address(address: server.Address, ev: React.MouseEvent<HTMLLIElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({
            offset: 1
        });

        this.props.onAddressSelected(address);

        return false;
    }

    select_email(email: server.Email, ev: React.MouseEvent<HTMLLIElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.props.onEmailSelected(email);

        return false;
    }

    render_address(address: server.Address, index: number) {
        return <li key={index} onClick={this.select_address.bind(this, address)}
            className={this.props.active_address && this.props.active_address.id == address.id ? "active": ""}>
            <small className="subtext">{address.email_address}</small>
            {address.unseen_count > 0
                ? <b>{address.short_name} ({address.unseen_count})</b>
                : address.short_name
            }<br />
        </li>
    }

    render_email(email: server.Email, index: number) {
        return <li key={index} onClick={this.select_email.bind(this, email)}
            className={this.props.active_email && this.props.active_email.id == email.id ? "active":""}>
        {email.seen
            ? email.from
            : <b>{email.from} *</b>}
            <br />
            {email.subject}
        </li>
    }

    render() {
        return <div className="sliding-row">
            <div style={{left: (-this.state.offset * 100) + "%"}}>
                <ul className="box-list">
                    {this.props.addresses.map(this.render_address.bind(this))}
                </ul>
            </div>
            <div style={{left: (-this.state.offset * 100) + "%"}}>
                <div onClick={this.back.bind(this)} style={{cursor: "pointer"}}>
                    &lt; Back
                </div>
                <ul className="box-list">
                    {this.props.emails.map(this.render_email.bind(this))}
                </ul>
            </div>
        </div>;
    }
}
