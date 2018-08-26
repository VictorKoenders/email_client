import * as React from "react";

interface State {
}

interface Props {
    email: server.Email;
}

export class MailRenderer extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
        };
    }

    render_body() {
        if(!this.props.email.text_plain_body) return null;
        return this.props.email.text_plain_body.split('\n').map((p, i) => <React.Fragment key={i}>{p}<br /></React.Fragment>);
    }

    render() {
        return <div>
            <h2>{this.props.email.subject}</h2>
            {this.props.email.from} -&gt; {this.props.email.to}<br /><br />
            {this.render_body()}
        </div>;
    }
}
