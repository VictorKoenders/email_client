import * as React from "react";

interface Props {
    onAuthenticate: (username: string, password: string) => void;
    clear_failed_login: () => void;
    failed_login: boolean;
}

interface State {
    username: string;
    password: string;
}

export class Login extends React.Component<Props, State> {
    constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            username: "",
            password: "",
        };
    }

    update_username(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({ username: ev.target.value });
        if(this.props.failed_login) {
            this.props.clear_failed_login();
        }
        return false;
    }
    update_password(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({ password: ev.target.value });
        if(this.props.failed_login) {
            this.props.clear_failed_login();
        }
        return false;
    }

    login(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        ev.stopPropagation();

        this.props.onAuthenticate(this.state.username, this.state.password);
        this.setState({ password: "" });

        return false;
    }

    render() {
        return <div className="card mx-auto" style={{ width: "600px" }}>
            <div className="card-header">
                Log in
            </div>
            <form className="card-body" onSubmit={this.login.bind(this)}>
                {this.props.failed_login ? <span className="text-danger">Login failed</span> : null}
                <div className="form-group row">
                    <label htmlFor="input_username" className="col-sm-3 col-form-label">Username</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" placeholder="Username" id="input_username"
                            value={this.state.username} onChange={this.update_username.bind(this)} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="input_password" className="col-sm-3 col-form-label">Password</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" placeholder="Password" id="input_password"
                            value={this.state.password} onChange={this.update_password.bind(this)} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary float-right">Log in</button>
            </form>
        </div>;
    }
}
