import * as React from "react";
import { Menu } from "./Menu";
import { MailRenderer } from "./MailRenderer";
import { Handler } from "../websocket";

interface State {
    addresses: server.Address[];
    emails: server.Email[];
    current_address: server.Address | null;
    current_email: server.Email | null;
    handler: Handler;
}

interface Props {
}

export class Root extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            addresses: [
            ],
            emails: [],
            current_address: null,
            current_email: null,
            handler: new Handler(this),
        };
    }

    email_received(email: server.Email) {
        this.setState(state => {
            let emails = state.emails.slice();
            emails.splice(0, 0, email);
            return { emails };
        });
    }

    inbox_loaded(address: server.Address, emails: server.Email[]) {
        this.setState(state => {
            if(state.current_address && state.current_address.short_name == address.short_name) {
                return { emails } as any;
            } else {
                return {};
            }
        });
    }

    setup(addresses: server.Address[]) {
        this.setState({ addresses });
    }

    select_address(address: server.Address) {
        this.state.handler.load_inbox(address);
        this.setState({
            current_address: address
        });
    }

    select_email(email: server.Email) {
        if(!email.seen) {
            email.seen = true;
            if(this.state.current_address) {
                this.state.current_address.unseen_count--;
            }
        }
        this.setState({
            current_email: email,
        });
    }

    render() {
        let emails: server.Email[] = [];
        return <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <Menu addresses={this.state.addresses}
                          emails={this.state.emails}
                          onAddressSelected={this.select_address.bind(this)}
                          onEmailSelected={this.select_email.bind(this)}
                          active_address={this.state.current_address}
                          />
                </div>
                <div className="col-md-8">
                    {this.state.current_email ? <MailRenderer {...this.state.current_email} /> : null}
                </div>
            </div>
        </div>;
    }
}
