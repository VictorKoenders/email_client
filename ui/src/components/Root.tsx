import * as React from "react";
import { Menu } from "./Menu";
import { MailRenderer } from "./MailRenderer";
import { Handler } from "../websocket";
import { Login } from "./Login";

interface State {
    addresses: server.Address[];
    emails: server.Email[];
    current_address: server.Address | null;
    current_email: server.Email | null;
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
            addresses: [
            ],
            emails: [],
            current_address: null,
            current_email: null,
            handler: new Handler(this),
            authenticated: false,
            failed_login: false,
        };
    }

    email_received(email: server.Email) {
        this.setState(state => {
            let emails = state.emails.slice();
            let addresses = state.addresses.slice();
            let address = addresses.find(a => a.id == email.address_id);
            if (address) {
                address.unseen_count++;
            }
            let current_address = state.current_address;
            if (current_address && current_address.id == email.address_id) {
                current_address.unseen_count++;
                if (email.address_id == current_address.id) {
                    emails.splice(0, 0, email);
                }
            }
            return { emails, current_address, addresses };
        });
    }

    inbox_loaded(address: server.Address, emails: server.Email[]) {
        this.setState(state => {
            if (state.current_address && state.current_address.short_name == address.short_name) {
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
        if (!email.seen) {
            email.seen = true;
            if (this.state.current_address) {
                this.state.current_address.unseen_count--;
            }
        }
        this.setState({
            current_email: email,
        });
    }

    authenticate_result(authenticated: boolean) {
        this.setState({ authenticated, failed_login: authenticated === false });
    }

    authenticate(username: string, password: string) {
        this.state.handler.authenticate(username, password);
    }

    clear_failed_login(){
        this.setState({failed_login: false});
    }

    render() {
        if (!this.state.authenticated) {
            return <Login onAuthenticate={this.authenticate.bind(this)} failed_login={this.state.failed_login} clear_failed_login={this.clear_failed_login.bind(this)} />;
        }
        return <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <Menu addresses={this.state.addresses}
                        emails={this.state.emails}
                        onAddressSelected={this.select_address.bind(this)}
                        onEmailSelected={this.select_email.bind(this)}
                        active_address={this.state.current_address}
                        active_email={this.state.current_email}
                    />
                </div>
                <div className="col-md-8">
                    {this.state.current_email ? <MailRenderer {...this.state.current_email} /> : null}
                </div>
            </div>
        </div>;
    }
}
