import * as React from "react";

interface State {
}

interface Props {
    from: string | null;
    to: string | null;
    subject: string | null;
    body: string[] | null;
}

export class MailRenderer extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
        };
    }

    render() {
        return <div>
            <h2>{this.props.subject}</h2>
            {this.props.from} -&gt; {this.props.to}<br /><br />
            {this.props.body}
        </div>;
    }
}