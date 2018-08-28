import * as React from "react";

interface State {
    show_html: boolean;
}

interface Props {
    email: server.Email;
}

export class MailRenderer extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            show_html: false,
        };
    }

    set_show_html(show_html: boolean, ev: React.MouseEvent<HTMLAnchorElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({ show_html });

        return false;
    }

    render_attachments() {
        const attachments = [];
        for (const attachment of this.props.email.attachments) {
            const name = attachment.name || ("unknown " + attachment.mime_type);
            attachments.push(
                <button type="button" className="btn btn-secondary" key={attachment.id}>
                    {name}
                </button>
            );
        }
        if (attachments.length > 0) {
            return <>
                <div className="btn-group" role="group" aria-label="Attachments">
                    {attachments}
                </div>
                <br />
            </>;
        }
        return null;
    }

    render_text_html_tabs() {
        return <ul className="nav nav-tabs">
            <li className="nav-item">
                <a className={"nav-link" + (this.state.show_html ? "" : " active")} href="#" onClick={this.set_show_html.bind(this, false)}>Plain text</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (this.state.show_html ? " active" : "")} href="#" onClick={this.set_show_html.bind(this, true)}>HTML</a>
            </li>
        </ul>
    }

    render_body() {
        if(this.state.show_html) {
            return <div dangerouslySetInnerHTML={{ __html: this.props.email.html_body || "" }} />;
        } else {
            return (this.props.email.text_plain_body || "").split('\n').map((p, i) => <React.Fragment key={i}>{p}<br /></React.Fragment>);
        }
    }

    render() {
        return <div>
            <h2>{this.props.email.subject}</h2>
            {this.props.email.from} -&gt; {this.props.email.to}<br /><br />
            {this.render_attachments()}
            {this.props.email.html_body ? this.render_text_html_tabs() : null}
            {this.render_body()}
        </div>;
    }
}
