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
        this.state = {};
    }
    render() {
        return React.createElement("div", null,
            React.createElement("h2", null, this.props.subject),
            this.props.from,
            " -> ",
            this.props.to,
            React.createElement("br", null),
            React.createElement("br", null),
            this.props.body);
    }
}
exports.MailRenderer = MailRenderer;


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
    select_address(address, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({
            offset: 1
        });
        this.props.onAddressSelected(address);
        return false;
    }
    select_email(email, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onEmailSelected(email);
        return false;
    }
    render_address(address, index) {
        return React.createElement("li", { key: index, onClick: this.select_address.bind(this, address), className: this.props.active_address && this.props.active_address.id == address.id ? "active" : "" },
            React.createElement("small", { className: "subtext" }, address.email_address),
            address.unseen_count > 0
                ? React.createElement("b", null,
                    address.short_name,
                    " (",
                    address.unseen_count,
                    ")")
                : address.short_name,
            React.createElement("br", null));
    }
    render_email(email, index) {
        return React.createElement("li", { key: index, onClick: this.select_email.bind(this, email), className: this.props.active_email && this.props.active_email.id == email.id ? "active" : "" },
            email.seen
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
                React.createElement("ul", { className: "box-list" }, this.props.addresses.map(this.render_address.bind(this)))),
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
class Root extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            addresses: [],
            emails: [],
            current_address: null,
            current_email: null,
            handler: new websocket_1.Handler(this),
        };
    }
    email_received(email) {
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
    inbox_loaded(address, emails) {
        this.setState(state => {
            if (state.current_address && state.current_address.short_name == address.short_name) {
                return { emails };
            }
            else {
                return {};
            }
        });
    }
    setup(addresses) {
        this.setState({ addresses });
    }
    select_address(address) {
        this.state.handler.load_inbox(address);
        this.setState({
            current_address: address
        });
    }
    select_email(email) {
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
    render() {
        let emails = [];
        return React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-4" },
                    React.createElement(Menu_1.Menu, { addresses: this.state.addresses, emails: this.state.emails, onAddressSelected: this.select_address.bind(this), onEmailSelected: this.select_email.bind(this), active_address: this.state.current_address, active_email: this.state.current_email })),
                React.createElement("div", { className: "col-md-8" }, this.state.current_email ? React.createElement(MailRenderer_1.MailRenderer, Object.assign({}, this.state.current_email)) : null)));
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
    load_inbox(address) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                load_inbox: address
            }));
        }
        this.current_inbox = address;
    }
    connect() {
        this.socket = new WebSocket("ws://" + document.location.host + "/ws/");
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
            this.handler.inbox_loaded(json.inbox_loaded.address, json.inbox_loaded.emails);
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