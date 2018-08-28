/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/Login.tsx":
/*!**********************************!*\
  !*** ./src/components/Login.tsx ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: "",
            password: "",
        };
    }
    update_username(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ username: ev.target.value });
        if (this.props.failed_login) {
            this.props.clear_failed_login();
        }
        return false;
    }
    update_password(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ password: ev.target.value });
        if (this.props.failed_login) {
            this.props.clear_failed_login();
        }
        return false;
    }
    login(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onAuthenticate(this.state.username, this.state.password);
        this.setState({ password: "" });
        return false;
    }
    render() {
        return React.createElement("div", { className: "card mx-auto", style: { width: "600px" } },
            React.createElement("div", { className: "card-header" }, "Log in"),
            React.createElement("form", { className: "card-body", onSubmit: this.login.bind(this) },
                this.props.failed_login ? React.createElement("span", { className: "text-danger" }, "Login failed") : null,
                React.createElement("div", { className: "form-group row" },
                    React.createElement("label", { htmlFor: "input_username", className: "col-sm-3 col-form-label" }, "Username"),
                    React.createElement("div", { className: "col-sm-9" },
                        React.createElement("input", { type: "text", className: "form-control", placeholder: "Username", id: "input_username", value: this.state.username, onChange: this.update_username.bind(this) }))),
                React.createElement("div", { className: "form-group row" },
                    React.createElement("label", { htmlFor: "input_password", className: "col-sm-3 col-form-label" }, "Password"),
                    React.createElement("div", { className: "col-sm-9" },
                        React.createElement("input", { type: "password", className: "form-control", placeholder: "Password", id: "input_password", value: this.state.password, onChange: this.update_password.bind(this) }))),
                React.createElement("button", { type: "submit", className: "btn btn-primary float-right" }, "Log in")));
    }
}
exports.Login = Login;


/***/ }),

/***/ "./src/components/MailRenderer.tsx":
/*!*****************************************!*\
  !*** ./src/components/MailRenderer.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
class MailRenderer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            show_html: false,
        };
    }
    set_show_html(show_html, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ show_html });
        return false;
    }
    select_attachment(attachment, ev) {
        this.props.handler.load_attachment(attachment);
    }
    download_attachment(attachment, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        document.location.href = "/attachment/" + attachment.id;
        return false;
    }
    render_attachments() {
        const attachments = [];
        for (const attachment of this.props.email.attachments) {
            const name = attachment.name || ("unknown " + attachment.mime_type);
            if (this.is_renderable_mime_type(attachment.mime_type)) {
                attachments.push(React.createElement("button", { type: "button", className: "btn btn-secondary", key: attachment.id, onClick: this.select_attachment.bind(this, attachment), "data-toggle": "modal", "data-target": "#attachment_popup" }, name));
            }
            else {
                attachments.push(React.createElement("button", { type: "button", className: "btn btn-secondary", key: attachment.id, onClick: this.download_attachment.bind(this, attachment) }, name));
            }
        }
        if (attachments.length > 0) {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "btn-group", role: "group", "aria-label": "Attachments" }, attachments),
                React.createElement("br", null));
        }
        return null;
    }
    is_renderable_mime_type(mime_type) {
        return mime_type.startsWith("image/");
    }
    render_attachment() {
        return React.createElement("b", null, "Prview not implemented");
    }
    render_attachment_modal() {
        let attachment_name = "unknown";
        let attachment_content = null;
        if (this.props.active_attachment) {
            if (this.props.active_attachment.name) {
                attachment_name = this.props.active_attachment.name;
            }
            attachment_name += " (" + this.props.active_attachment.mime_type + ")";
            if (this.is_renderable_mime_type(this.props.active_attachment.mime_type)) {
                var base64 = base64ArrayBuffer(this.props.active_attachment.contents);
                attachment_content = React.createElement("img", { src: "data:" + this.props.active_attachment.mime_type + ";base64," + base64 });
            }
        }
        return React.createElement("div", { className: "modal fade bd-example-modal-lg", tabIndex: -1, role: "dialog", "aria-labelledby": "myLargeModalLabel", "aria-hidden": "true", id: "attachment_popup" },
            React.createElement("div", { className: "modal-dialog modal-lg" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("h5", { className: "modal-title" }, this.props.active_attachment
                            ? attachment_name
                            : ""),
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                    React.createElement("div", { className: "modal-body" }, attachment_content),
                    React.createElement("div", { className: "modal-footer" },
                        this.props.active_attachment
                            ? React.createElement("a", { href: "/attachment/" + this.props.active_attachment.id, className: "btn btn-default" }, "Download")
                            : null,
                        React.createElement("button", { type: "button", className: "btn btn-primary", "data-dismiss": "modal" }, "Close")))));
    }
    render_text_html_tabs() {
        return React.createElement("ul", { className: "nav nav-tabs" },
            React.createElement("li", { className: "nav-item" },
                React.createElement("a", { className: "nav-link" + (this.state.show_html ? "" : " active"), href: "#", onClick: this.set_show_html.bind(this, false) }, "Plain text")),
            React.createElement("li", { className: "nav-item" },
                React.createElement("a", { className: "nav-link" + (this.state.show_html ? " active" : ""), href: "#", onClick: this.set_show_html.bind(this, true) }, "HTML")));
    }
    render_body() {
        if (this.state.show_html) {
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.email.html_body || "" } });
        }
        else {
            return (this.props.email.text_plain_body || "").split('\n').map((p, i) => React.createElement(React.Fragment, { key: i },
                p,
                React.createElement("br", null)));
        }
    }
    render() {
        return React.createElement("div", null,
            React.createElement("h2", null, this.props.email.subject),
            this.props.email.from,
            " -> ",
            this.props.email.to,
            React.createElement("br", null),
            React.createElement("br", null),
            this.render_attachments(),
            this.render_attachment_modal(),
            this.props.email.html_body ? this.render_text_html_tabs() : null,
            this.render_body());
    }
}
exports.MailRenderer = MailRenderer;
function base64ArrayBuffer(arrayBuffer) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + '==';
    }
    else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return base64;
}


/***/ }),

/***/ "./src/components/Menu.tsx":
/*!*********************************!*\
  !*** ./src/components/Menu.tsx ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
class Menu extends React.Component {
    constructor(props, context) {
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
    select_inbox(inbox, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({
            offset: 1
        });
        this.props.onInboxSelected(inbox);
        return false;
    }
    select_email(email, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onEmailSelected(email);
        return false;
    }
    render_inbox(inbox, index) {
        return React.createElement("li", { key: index, onClick: this.select_inbox.bind(this, inbox), className: this.props.active_inbox && this.props.active_inbox.id == inbox.id ? "active" : "" },
            inbox.unread_count > 0
                ? React.createElement("b", null,
                    inbox.name,
                    " (",
                    inbox.unread_count,
                    ")")
                : inbox.name,
            React.createElement("br", null));
    }
    render_email(email, index) {
        return React.createElement("li", { key: index, onClick: this.select_email.bind(this, email), className: this.props.active_email && this.props.active_email.id == email.id ? "active" : "" },
            email.read
                ? email.from
                : React.createElement("b", null,
                    email.from,
                    " *"),
            React.createElement("br", null),
            email.subject);
    }
    render() {
        return React.createElement("div", { className: "sliding-row" },
            React.createElement("div", { style: { left: (-this.state.offset * 100) + "%" } },
                React.createElement("ul", { className: "box-list" }, this.props.inboxes.map(this.render_inbox.bind(this)))),
            React.createElement("div", { style: { left: (-this.state.offset * 100) + "%" } },
                React.createElement("div", { onClick: this.back.bind(this), style: { cursor: "pointer" } }, "< Back"),
                React.createElement("ul", { className: "box-list" }, this.props.emails.map(this.render_email.bind(this)))));
    }
}
exports.Menu = Menu;


/***/ }),

/***/ "./src/components/Root.tsx":
/*!*********************************!*\
  !*** ./src/components/Root.tsx ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const Menu_1 = __webpack_require__(/*! ./Menu */ "./src/components/Menu.tsx");
const MailRenderer_1 = __webpack_require__(/*! ./MailRenderer */ "./src/components/MailRenderer.tsx");
const websocket_1 = __webpack_require__(/*! ../websocket */ "./src/websocket.ts");
const Login_1 = __webpack_require__(/*! ./Login */ "./src/components/Login.tsx");
class Root extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            inboxes: [],
            emails: [],
            current_inbox: null,
            current_email_info: null,
            current_email: null,
            current_attachment: null,
            handler: new websocket_1.Handler(this),
            authenticated: false,
            failed_login: false,
        };
    }
    email_received(email) {
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
    inbox_loaded(inbox, emails) {
        this.setState(state => {
            if (state.current_inbox && state.current_inbox.name == inbox.name) {
                return { emails };
            }
            else {
                return {};
            }
        });
    }
    attachment_loaded(attachment) {
        this.setState({
            current_attachment: attachment
        });
    }
    email_loaded(email) {
        this.setState(state => {
            if (state.current_email_info && state.current_email_info.id == email.id) {
                return { current_email: email };
            }
            else {
                return {};
            }
        });
    }
    setup(inboxes) {
        this.setState({ inboxes });
    }
    select_inbox(inbox) {
        this.state.handler.load_inbox(inbox);
        this.setState({
            current_inbox: inbox
        });
    }
    select_email(email) {
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
    authenticate_result(authenticated) {
        this.setState({ authenticated, failed_login: authenticated === false });
    }
    authenticate(username, password) {
        this.state.handler.authenticate(username, password);
    }
    clear_failed_login() {
        this.setState({ failed_login: false });
    }
    render() {
        if (!this.state.authenticated) {
            return React.createElement(Login_1.Login, { onAuthenticate: this.authenticate.bind(this), failed_login: this.state.failed_login, clear_failed_login: this.clear_failed_login.bind(this) });
        }
        return React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-4" },
                    React.createElement(Menu_1.Menu, { inboxes: this.state.inboxes, emails: this.state.emails, onInboxSelected: this.select_inbox.bind(this), onEmailSelected: this.select_email.bind(this), active_inbox: this.state.current_inbox, active_email: this.state.current_email })),
                React.createElement("div", { className: "col-md-8" }, this.state.current_email ? React.createElement(MailRenderer_1.MailRenderer, { email: this.state.current_email, active_attachment: this.state.current_attachment, handler: this.state.handler }) : null)));
    }
}
exports.Root = Root;


/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");
const Root_1 = __webpack_require__(/*! ./components/Root */ "./src/components/Root.tsx");
ReactDOM.render(React.createElement(Root_1.Root, null), document.getElementById("example"));


/***/ }),

/***/ "./src/websocket.ts":
/*!**************************!*\
  !*** ./src/websocket.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Handler {
    constructor(handler) {
        this.socket = null;
        this.reconnect_timeout = null;
        this.handler = handler;
        this.current_inbox = null;
        this.connect();
    }
    authenticate(username, password) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                authenticate: {
                    username,
                    password
                }
            }));
        }
    }
    load_inbox(inbox) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_inbox: inbox
            }));
        }
        this.current_inbox = inbox;
    }
    load_email(email) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_email: email
            }));
        }
    }
    load_attachment(attachment) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_attachment: attachment
            }));
        }
    }
    connect() {
        this.socket = new WebSocket((document.location.protocol === "https:" ? "wss://" : "ws://") +
            document.location.host +
            document.location.pathname +
            "ws/");
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    }
    onopen(ev) {
    }
    onclose(ev) {
        this.socket = null;
        if (this.reconnect_timeout) {
            clearTimeout(this.reconnect_timeout);
        }
        this.reconnect_timeout = setTimeout(() => {
            this.connect();
        }, 5000);
        this.handler.authenticate_result(false);
    }
    onerror(ev) {
        console.error("[Websocket]", ev);
    }
    onmessage(ev) {
        let json = JSON.parse(ev.data);
        if (json.init) {
            this.handler.setup(json.init);
            if (this.current_inbox) {
                this.load_inbox(this.current_inbox);
            }
        }
        else if (json.email_received) {
            this.handler.email_received(json.email_received);
        }
        else if (json.inbox_loaded) {
            this.handler.inbox_loaded(json.inbox_loaded.inbox_with_address, json.inbox_loaded.emails);
        }
        else if (json.email_loaded) {
            this.handler.email_loaded(json.email_loaded);
        }
        else if (json.attachment_loaded) {
            this.handler.attachment_loaded(json.attachment_loaded);
        }
        else if (json.authenticate_result === true || json.authenticate_result === false) {
            this.handler.authenticate_result(json.authenticate_result);
        }
        else {
            console.log("Unknown server message", json);
        }
    }
}
exports.Handler = Handler;


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map