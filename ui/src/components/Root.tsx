import * as React from "react";
import { Menu } from "./Menu";
import { MailRenderer } from "./MailRenderer";

interface State {
    addresses: server.Address[];
    emails: {[key: string]: server.Email[]};
    current_address: server.Address | null;
    current_email: server.Email | null;
}

interface Props {
}

export class Root extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            addresses: [
                { short_name: "Catch-all", email_address: "*@trangar.com", unseen_count: 1 },
                { short_name: "LinkedIn", email_address: "linkedin@trangar.com", unseen_count: 1 },
                { short_name: "Twitter", email_address: "twitter@trangar.com", unseen_count: 1 },
                { short_name: "Amazon", email_address: "amazon@trangar.com", unseen_count: 0 }
            ],
            emails: {
                "linkedin@trangar.com": [
                    { from: "no-reply@linkedin.com", to: "linkedin@trangar.com", subject: "Hello", body: ["This is spam"], seen: false},
                ],
                "*@trangar.com": [
                    { from: "no-reply@butts.com", to: "butts@trangar.com", subject: "Hahaha", body: ["Butts"], seen: false},
                ],
                "twitter@trangar.com": [
                    { from: "no-reply@twitter.com", to: "twitter@trangar.com", subject: "Someone like your tweet", body: ["You're so funny and witty"], seen: false},
                ]
            },
            current_address: null,
            current_email: null,
        };
    }

    select_address(address: server.Address) {
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
        if(this.state.current_address && this.state.current_address.short_name &&
            Array.isArray(this.state.emails[this.state.current_address.email_address])){
            emails = this.state.emails[this.state.current_address.email_address];
        }
        return <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <Menu addresses={this.state.addresses}
                          emails={emails}
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
