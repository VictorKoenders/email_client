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

/***/ "./node_modules/@protobufjs/aspromise/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@protobufjs/aspromise/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}


/***/ }),

/***/ "./node_modules/@protobufjs/base64/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@protobufjs/base64/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ "./node_modules/@protobufjs/eventemitter/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@protobufjs/eventemitter/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};


/***/ }),

/***/ "./node_modules/@protobufjs/float/index.js":
/*!*************************************************!*\
  !*** ./node_modules/@protobufjs/float/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}


/***/ }),

/***/ "./node_modules/@protobufjs/inquire/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@protobufjs/inquire/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}


/***/ }),

/***/ "./node_modules/@protobufjs/pool/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/pool/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}


/***/ }),

/***/ "./node_modules/@protobufjs/utf8/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/utf8/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ "./node_modules/protobufjs/minimal.js":
/*!********************************************!*\
  !*** ./node_modules/protobufjs/minimal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// minimal library entry point.


module.exports = __webpack_require__(/*! ./src/index-minimal */ "./node_modules/protobufjs/src/index-minimal.js");


/***/ }),

/***/ "./node_modules/protobufjs/src/index-minimal.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/index-minimal.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = __webpack_require__(/*! ./writer */ "./node_modules/protobufjs/src/writer.js");
protobuf.BufferWriter = __webpack_require__(/*! ./writer_buffer */ "./node_modules/protobufjs/src/writer_buffer.js");
protobuf.Reader       = __webpack_require__(/*! ./reader */ "./node_modules/protobufjs/src/reader.js");
protobuf.BufferReader = __webpack_require__(/*! ./reader_buffer */ "./node_modules/protobufjs/src/reader_buffer.js");

// Utility
protobuf.util         = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");
protobuf.rpc          = __webpack_require__(/*! ./rpc */ "./node_modules/protobufjs/src/rpc.js");
protobuf.roots        = __webpack_require__(/*! ./roots */ "./node_modules/protobufjs/src/roots.js");
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.Reader._configure(protobuf.BufferReader);
    protobuf.util._configure();
}

// Set up buffer utility according to the environment
protobuf.Writer._configure(protobuf.BufferWriter);
configure();


/***/ }),

/***/ "./node_modules/protobufjs/src/reader.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/reader.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Reader;

var util      = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = util.Buffer
    ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
            return util.Buffer.isBuffer(buffer)
                ? new BufferReader(buffer)
                /* istanbul ignore next */
                : create_array(buffer);
        })(buffer);
    }
    /* istanbul ignore next */
    : create_array;

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};


/***/ }),

/***/ "./node_modules/protobufjs/src/reader_buffer.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/reader_buffer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = BufferReader;

// extends Reader
var Reader = __webpack_require__(/*! ./reader */ "./node_modules/protobufjs/src/reader.js");
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

/* istanbul ignore else */
if (util.Buffer)
    BufferReader.prototype._slice = util.Buffer.prototype.slice;

/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */


/***/ }),

/***/ "./node_modules/protobufjs/src/roots.js":
/*!**********************************************!*\
  !*** ./node_modules/protobufjs/src/roots.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available accross modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */


/***/ }),

/***/ "./node_modules/protobufjs/src/rpc.js":
/*!********************************************!*\
  !*** ./node_modules/protobufjs/src/rpc.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = __webpack_require__(/*! ./rpc/service */ "./node_modules/protobufjs/src/rpc/service.js");


/***/ }),

/***/ "./node_modules/protobufjs/src/rpc/service.js":
/*!****************************************************!*\
  !*** ./node_modules/protobufjs/src/rpc/service.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Service;

var util = __webpack_require__(/*! ../util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/util/longbits.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/util/longbits.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = LongBits;

var util = __webpack_require__(/*! ../util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/util/minimal.js":
/*!*****************************************************!*\
  !*** ./node_modules/protobufjs/src/util/minimal.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = __webpack_require__(/*! @protobufjs/aspromise */ "./node_modules/@protobufjs/aspromise/index.js");

// converts to / from base64 encoded strings
util.base64 = __webpack_require__(/*! @protobufjs/base64 */ "./node_modules/@protobufjs/base64/index.js");

// base class of rpc.Service
util.EventEmitter = __webpack_require__(/*! @protobufjs/eventemitter */ "./node_modules/@protobufjs/eventemitter/index.js");

// float handling accross browsers
util.float = __webpack_require__(/*! @protobufjs/float */ "./node_modules/@protobufjs/float/index.js");

// requires modules optionally and hides the call from bundlers
util.inquire = __webpack_require__(/*! @protobufjs/inquire */ "./node_modules/@protobufjs/inquire/index.js");

// converts to / from utf8 encoded strings
util.utf8 = __webpack_require__(/*! @protobufjs/utf8 */ "./node_modules/@protobufjs/utf8/index.js");

// provides a node-like buffer pool in the browser
util.pool = __webpack_require__(/*! @protobufjs/pool */ "./node_modules/@protobufjs/pool/index.js");

// utility to work with the low and high bits of a 64 bit value
util.LongBits = __webpack_require__(/*! ./longbits */ "./node_modules/protobufjs/src/util/longbits.js");

// global object reference
util.global = typeof window !== "undefined" && window
           || typeof global !== "undefined" && global
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 * @const
 */
util.isNode = Boolean(util.global.process && util.global.process.versions && util.global.process.versions.node);

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/protobufjs/src/writer.js":
/*!***********************************************!*\
  !*** ./node_modules/protobufjs/src/writer.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Writer;

var util      = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = util.Buffer
    ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
            return new BufferWriter();
        })();
    }
    /* istanbul ignore next */
    : function create_array() {
        return new Writer();
    };

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
};


/***/ }),

/***/ "./node_modules/protobufjs/src/writer_buffer.js":
/*!******************************************************!*\
  !*** ./node_modules/protobufjs/src/writer_buffer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = BufferWriter;

// extends Writer
var Writer = __webpack_require__(/*! ./writer */ "./node_modules/protobufjs/src/writer.js");
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = __webpack_require__(/*! ./util/minimal */ "./node_modules/protobufjs/src/util/minimal.js");

var Buffer = util.Buffer;

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Buffer} Buffer
 */
BufferWriter.alloc = function alloc_buffer(size) {
    return (BufferWriter.alloc = util._Buffer_allocUnsafe)(size);
};

var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
    ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                           // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
    };

/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else
        buf.utf8Write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/components/AttachmentPopup.tsx":
/*!********************************************!*\
  !*** ./src/components/AttachmentPopup.tsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
exports.MODAL_ID = "attachment_modal";
class AttachmentPopup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    static is_renderable_mime_type(mime_type) {
        return mime_type.startsWith("image/");
    }
    static is_text_mime_type(mime_type) {
        return mime_type.startsWith("text/") || mime_type.startsWith("multipart/");
    }
    render() {
        let attachment_name = "unknown";
        let attachment_content = null;
        if (this.props.current && this.props.current.contents && this.props.current.mimeType) {
            if (this.props.current.name) {
                attachment_name = this.props.current.name;
            }
            attachment_name += " (" + this.props.current.mimeType + ")";
            if (AttachmentPopup.is_renderable_mime_type(this.props.current.mimeType)) {
                var base64 = base64ArrayBuffer(this.props.current.contents);
                attachment_content = React.createElement("img", { src: "data:" + this.props.current.mimeType + ";base64," + base64 });
            }
            if (AttachmentPopup.is_text_mime_type(this.props.current.mimeType)) {
                attachment_content = React.createElement("pre", null, String.fromCharCode.apply(null, this.props.current.contents));
            }
        }
        return React.createElement("div", { className: "modal fade bd-example-modal-lg", tabIndex: -1, role: "dialog", "aria-labelledby": "myLargeModalLabel", "aria-hidden": "true", id: exports.MODAL_ID },
            React.createElement("div", { className: "modal-dialog modal-lg" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("h5", { className: "modal-title" }, this.props.current
                            ? attachment_name
                            : ""),
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                    React.createElement("div", { className: "modal-body" }, attachment_content),
                    React.createElement("div", { className: "modal-footer" },
                        this.props.current
                            ? React.createElement("a", { href: "attachment/" + this.props.current.id, className: "btn btn-default" }, "Download")
                            : null,
                        React.createElement("button", { type: "button", className: "btn btn-primary", "data-dismiss": "modal" }, "Close")))));
    }
}
exports.AttachmentPopup = AttachmentPopup;
function base64ArrayBuffer(bytes) {
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
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
const AttachmentPopup_1 = __webpack_require__(/*! ./AttachmentPopup */ "./src/components/AttachmentPopup.tsx");
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
        document.location.href = "attachment/" + attachment.id;
        return false;
    }
    render_attachments() {
        if (this.props.email.attachments == null)
            return null;
        const attachments = [];
        for (const attachment of this.props.email.attachments) {
            const name = attachment.name || ("unknown " + attachment.mimeType);
            if (AttachmentPopup_1.AttachmentPopup.is_renderable_mime_type(attachment.mimeType || "")) {
                attachments.push(React.createElement("button", { type: "button", className: "btn btn-secondary", key: attachment.id || "", onClick: this.select_attachment.bind(this, attachment), "data-toggle": "modal", "data-target": "#" + AttachmentPopup_1.MODAL_ID }, name));
            }
            else {
                attachments.push(React.createElement("button", { type: "button", className: "btn btn-secondary", key: attachment.id || "", onClick: this.download_attachment.bind(this, attachment) }, name));
            }
        }
        if (attachments.length > 0) {
            return React.createElement(React.Fragment, null,
                React.createElement("div", { className: "btn-group", style: { flexWrap: "wrap" }, role: "group", "aria-label": "Attachments" }, attachments),
                React.createElement("br", null));
        }
        return null;
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
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.email.htmlBody || "" } });
        }
        else {
            return (this.props.email.textPlainBody || "").split('\n').map((p, i) => React.createElement(React.Fragment, { key: i },
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
            this.props.email.htmlBody ? this.render_text_html_tabs() : null,
            this.render_body());
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
            inbox.unreadCount
                ? React.createElement("b", null,
                    inbox.name,
                    " (",
                    inbox.unreadCount,
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
const AttachmentPopup_1 = __webpack_require__(/*! ./AttachmentPopup */ "./src/components/AttachmentPopup.tsx");
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
            let inbox = inboxes.find(a => a.id == email.inboxId);
            if (inbox) {
                inbox.unreadCount = (inbox.unreadCount || 0) + 1;
            }
            if (current_inbox && current_inbox.id == email.inboxId) {
                current_inbox.unreadCount = (current_inbox.unreadCount || 0) + 1;
                if (email.inboxId == current_inbox.id) {
                    emails.splice(0, 0, email);
                }
            }
            return { emails, current_inbox, inboxes };
        });
    }
    inbox_loaded(inbox) {
        this.setState(state => {
            if (state.current_inbox && state.current_inbox.name == inbox.name) {
                return { emails: inbox.emails };
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
                this.state.current_inbox.unreadCount = (this.state.current_inbox.unreadCount || 1) - 1;
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
        return React.createElement("div", { className: "container-fluid" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-md-4", style: { overflowY: "auto", height: "100vh" } },
                    React.createElement(Menu_1.Menu, { inboxes: this.state.inboxes, emails: this.state.emails, onInboxSelected: this.select_inbox.bind(this), onEmailSelected: this.select_email.bind(this), active_inbox: this.state.current_inbox, active_email: this.state.current_email })),
                React.createElement("div", { className: "col-md-8", style: { overflowY: "auto", height: "100vh" } }, this.state.current_email ? React.createElement(MailRenderer_1.MailRenderer, { email: this.state.current_email, handler: this.state.handler }) : null),
                React.createElement(AttachmentPopup_1.AttachmentPopup, { current: this.state.current_attachment })));
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
window.replace_url_by_image = function (element) {
    const parent = element.parentElement;
    const new_node = document.createElement("img");
    new_node.src = element.href;
    parent.replaceChild(new_node, element);
    return false;
};


/***/ }),

/***/ "./src/protobuf_compiled.js":
/*!**********************************!*\
  !*** ./src/protobuf_compiled.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (true)
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! protobufjs/minimal */ "./node_modules/protobufjs/minimal.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

    /* CommonJS */ else {}

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.email_client = (function() {
    
        /**
         * Namespace email_client.
         * @exports email_client
         * @namespace
         */
        var email_client = {};
    
        email_client.ClientToServer = (function() {
    
            /**
             * Properties of a ClientToServer.
             * @memberof email_client
             * @interface IClientToServer
             * @property {email_client.ILoadInboxRequest|null} [loadInbox] ClientToServer loadInbox
             * @property {email_client.IAuthenticateRequest|null} [authenticate] ClientToServer authenticate
             * @property {email_client.ILoadEmailRequest|null} [loadEmail] ClientToServer loadEmail
             * @property {email_client.ILoadAttachmentRequest|null} [loadAttachment] ClientToServer loadAttachment
             */
    
            /**
             * Constructs a new ClientToServer.
             * @memberof email_client
             * @classdesc Represents a ClientToServer.
             * @implements IClientToServer
             * @constructor
             * @param {email_client.IClientToServer=} [properties] Properties to set
             */
            function ClientToServer(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ClientToServer loadInbox.
             * @member {email_client.ILoadInboxRequest|null|undefined} loadInbox
             * @memberof email_client.ClientToServer
             * @instance
             */
            ClientToServer.prototype.loadInbox = null;
    
            /**
             * ClientToServer authenticate.
             * @member {email_client.IAuthenticateRequest|null|undefined} authenticate
             * @memberof email_client.ClientToServer
             * @instance
             */
            ClientToServer.prototype.authenticate = null;
    
            /**
             * ClientToServer loadEmail.
             * @member {email_client.ILoadEmailRequest|null|undefined} loadEmail
             * @memberof email_client.ClientToServer
             * @instance
             */
            ClientToServer.prototype.loadEmail = null;
    
            /**
             * ClientToServer loadAttachment.
             * @member {email_client.ILoadAttachmentRequest|null|undefined} loadAttachment
             * @memberof email_client.ClientToServer
             * @instance
             */
            ClientToServer.prototype.loadAttachment = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * ClientToServer message.
             * @member {"loadInbox"|"authenticate"|"loadEmail"|"loadAttachment"|undefined} message
             * @memberof email_client.ClientToServer
             * @instance
             */
            Object.defineProperty(ClientToServer.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["loadInbox", "authenticate", "loadEmail", "loadAttachment"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new ClientToServer instance using the specified properties.
             * @function create
             * @memberof email_client.ClientToServer
             * @static
             * @param {email_client.IClientToServer=} [properties] Properties to set
             * @returns {email_client.ClientToServer} ClientToServer instance
             */
            ClientToServer.create = function create(properties) {
                return new ClientToServer(properties);
            };
    
            /**
             * Encodes the specified ClientToServer message. Does not implicitly {@link email_client.ClientToServer.verify|verify} messages.
             * @function encode
             * @memberof email_client.ClientToServer
             * @static
             * @param {email_client.IClientToServer} message ClientToServer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientToServer.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.loadInbox != null && message.hasOwnProperty("loadInbox"))
                    $root.email_client.LoadInboxRequest.encode(message.loadInbox, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.authenticate != null && message.hasOwnProperty("authenticate"))
                    $root.email_client.AuthenticateRequest.encode(message.authenticate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.loadEmail != null && message.hasOwnProperty("loadEmail"))
                    $root.email_client.LoadEmailRequest.encode(message.loadEmail, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.loadAttachment != null && message.hasOwnProperty("loadAttachment"))
                    $root.email_client.LoadAttachmentRequest.encode(message.loadAttachment, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified ClientToServer message, length delimited. Does not implicitly {@link email_client.ClientToServer.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.ClientToServer
             * @static
             * @param {email_client.IClientToServer} message ClientToServer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientToServer.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ClientToServer message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.ClientToServer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.ClientToServer} ClientToServer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientToServer.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.ClientToServer();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.loadInbox = $root.email_client.LoadInboxRequest.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.authenticate = $root.email_client.AuthenticateRequest.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.loadEmail = $root.email_client.LoadEmailRequest.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.loadAttachment = $root.email_client.LoadAttachmentRequest.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ClientToServer message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.ClientToServer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.ClientToServer} ClientToServer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientToServer.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ClientToServer message.
             * @function verify
             * @memberof email_client.ClientToServer
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClientToServer.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.loadInbox != null && message.hasOwnProperty("loadInbox")) {
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadInboxRequest.verify(message.loadInbox);
                        if (error)
                            return "loadInbox." + error;
                    }
                }
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.AuthenticateRequest.verify(message.authenticate);
                        if (error)
                            return "authenticate." + error;
                    }
                }
                if (message.loadEmail != null && message.hasOwnProperty("loadEmail")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadEmailRequest.verify(message.loadEmail);
                        if (error)
                            return "loadEmail." + error;
                    }
                }
                if (message.loadAttachment != null && message.hasOwnProperty("loadAttachment")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadAttachmentRequest.verify(message.loadAttachment);
                        if (error)
                            return "loadAttachment." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a ClientToServer message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.ClientToServer
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.ClientToServer} ClientToServer
             */
            ClientToServer.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.ClientToServer)
                    return object;
                var message = new $root.email_client.ClientToServer();
                if (object.loadInbox != null) {
                    if (typeof object.loadInbox !== "object")
                        throw TypeError(".email_client.ClientToServer.loadInbox: object expected");
                    message.loadInbox = $root.email_client.LoadInboxRequest.fromObject(object.loadInbox);
                }
                if (object.authenticate != null) {
                    if (typeof object.authenticate !== "object")
                        throw TypeError(".email_client.ClientToServer.authenticate: object expected");
                    message.authenticate = $root.email_client.AuthenticateRequest.fromObject(object.authenticate);
                }
                if (object.loadEmail != null) {
                    if (typeof object.loadEmail !== "object")
                        throw TypeError(".email_client.ClientToServer.loadEmail: object expected");
                    message.loadEmail = $root.email_client.LoadEmailRequest.fromObject(object.loadEmail);
                }
                if (object.loadAttachment != null) {
                    if (typeof object.loadAttachment !== "object")
                        throw TypeError(".email_client.ClientToServer.loadAttachment: object expected");
                    message.loadAttachment = $root.email_client.LoadAttachmentRequest.fromObject(object.loadAttachment);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a ClientToServer message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.ClientToServer
             * @static
             * @param {email_client.ClientToServer} message ClientToServer
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClientToServer.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.loadInbox != null && message.hasOwnProperty("loadInbox")) {
                    object.loadInbox = $root.email_client.LoadInboxRequest.toObject(message.loadInbox, options);
                    if (options.oneofs)
                        object.message = "loadInbox";
                }
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    object.authenticate = $root.email_client.AuthenticateRequest.toObject(message.authenticate, options);
                    if (options.oneofs)
                        object.message = "authenticate";
                }
                if (message.loadEmail != null && message.hasOwnProperty("loadEmail")) {
                    object.loadEmail = $root.email_client.LoadEmailRequest.toObject(message.loadEmail, options);
                    if (options.oneofs)
                        object.message = "loadEmail";
                }
                if (message.loadAttachment != null && message.hasOwnProperty("loadAttachment")) {
                    object.loadAttachment = $root.email_client.LoadAttachmentRequest.toObject(message.loadAttachment, options);
                    if (options.oneofs)
                        object.message = "loadAttachment";
                }
                return object;
            };
    
            /**
             * Converts this ClientToServer to JSON.
             * @function toJSON
             * @memberof email_client.ClientToServer
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClientToServer.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ClientToServer;
        })();
    
        email_client.ServerToClient = (function() {
    
            /**
             * Properties of a ServerToClient.
             * @memberof email_client
             * @interface IServerToClient
             * @property {email_client.IError|null} [error] ServerToClient error
             * @property {email_client.IAuthenticateResponse|null} [authenticate] ServerToClient authenticate
             * @property {email_client.ILoadInboxResponse|null} [inbox] ServerToClient inbox
             * @property {email_client.ILoadEmailResponse|null} [email] ServerToClient email
             * @property {email_client.ILoadAttachmentResponse|null} [attachment] ServerToClient attachment
             */
    
            /**
             * Constructs a new ServerToClient.
             * @memberof email_client
             * @classdesc Represents a ServerToClient.
             * @implements IServerToClient
             * @constructor
             * @param {email_client.IServerToClient=} [properties] Properties to set
             */
            function ServerToClient(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ServerToClient error.
             * @member {email_client.IError|null|undefined} error
             * @memberof email_client.ServerToClient
             * @instance
             */
            ServerToClient.prototype.error = null;
    
            /**
             * ServerToClient authenticate.
             * @member {email_client.IAuthenticateResponse|null|undefined} authenticate
             * @memberof email_client.ServerToClient
             * @instance
             */
            ServerToClient.prototype.authenticate = null;
    
            /**
             * ServerToClient inbox.
             * @member {email_client.ILoadInboxResponse|null|undefined} inbox
             * @memberof email_client.ServerToClient
             * @instance
             */
            ServerToClient.prototype.inbox = null;
    
            /**
             * ServerToClient email.
             * @member {email_client.ILoadEmailResponse|null|undefined} email
             * @memberof email_client.ServerToClient
             * @instance
             */
            ServerToClient.prototype.email = null;
    
            /**
             * ServerToClient attachment.
             * @member {email_client.ILoadAttachmentResponse|null|undefined} attachment
             * @memberof email_client.ServerToClient
             * @instance
             */
            ServerToClient.prototype.attachment = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * ServerToClient message.
             * @member {"error"|"authenticate"|"inbox"|"email"|"attachment"|undefined} message
             * @memberof email_client.ServerToClient
             * @instance
             */
            Object.defineProperty(ServerToClient.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["error", "authenticate", "inbox", "email", "attachment"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new ServerToClient instance using the specified properties.
             * @function create
             * @memberof email_client.ServerToClient
             * @static
             * @param {email_client.IServerToClient=} [properties] Properties to set
             * @returns {email_client.ServerToClient} ServerToClient instance
             */
            ServerToClient.create = function create(properties) {
                return new ServerToClient(properties);
            };
    
            /**
             * Encodes the specified ServerToClient message. Does not implicitly {@link email_client.ServerToClient.verify|verify} messages.
             * @function encode
             * @memberof email_client.ServerToClient
             * @static
             * @param {email_client.IServerToClient} message ServerToClient message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerToClient.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.error != null && message.hasOwnProperty("error"))
                    $root.email_client.Error.encode(message.error, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.authenticate != null && message.hasOwnProperty("authenticate"))
                    $root.email_client.AuthenticateResponse.encode(message.authenticate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.inbox != null && message.hasOwnProperty("inbox"))
                    $root.email_client.LoadInboxResponse.encode(message.inbox, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.email != null && message.hasOwnProperty("email"))
                    $root.email_client.LoadEmailResponse.encode(message.email, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.attachment != null && message.hasOwnProperty("attachment"))
                    $root.email_client.LoadAttachmentResponse.encode(message.attachment, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified ServerToClient message, length delimited. Does not implicitly {@link email_client.ServerToClient.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.ServerToClient
             * @static
             * @param {email_client.IServerToClient} message ServerToClient message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerToClient.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ServerToClient message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.ServerToClient
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.ServerToClient} ServerToClient
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerToClient.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.ServerToClient();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.error = $root.email_client.Error.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.authenticate = $root.email_client.AuthenticateResponse.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.inbox = $root.email_client.LoadInboxResponse.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.email = $root.email_client.LoadEmailResponse.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.attachment = $root.email_client.LoadAttachmentResponse.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ServerToClient message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.ServerToClient
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.ServerToClient} ServerToClient
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerToClient.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ServerToClient message.
             * @function verify
             * @memberof email_client.ServerToClient
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerToClient.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.error != null && message.hasOwnProperty("error")) {
                    properties.message = 1;
                    {
                        var error = $root.email_client.Error.verify(message.error);
                        if (error)
                            return "error." + error;
                    }
                }
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.AuthenticateResponse.verify(message.authenticate);
                        if (error)
                            return "authenticate." + error;
                    }
                }
                if (message.inbox != null && message.hasOwnProperty("inbox")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadInboxResponse.verify(message.inbox);
                        if (error)
                            return "inbox." + error;
                    }
                }
                if (message.email != null && message.hasOwnProperty("email")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadEmailResponse.verify(message.email);
                        if (error)
                            return "email." + error;
                    }
                }
                if (message.attachment != null && message.hasOwnProperty("attachment")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.email_client.LoadAttachmentResponse.verify(message.attachment);
                        if (error)
                            return "attachment." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a ServerToClient message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.ServerToClient
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.ServerToClient} ServerToClient
             */
            ServerToClient.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.ServerToClient)
                    return object;
                var message = new $root.email_client.ServerToClient();
                if (object.error != null) {
                    if (typeof object.error !== "object")
                        throw TypeError(".email_client.ServerToClient.error: object expected");
                    message.error = $root.email_client.Error.fromObject(object.error);
                }
                if (object.authenticate != null) {
                    if (typeof object.authenticate !== "object")
                        throw TypeError(".email_client.ServerToClient.authenticate: object expected");
                    message.authenticate = $root.email_client.AuthenticateResponse.fromObject(object.authenticate);
                }
                if (object.inbox != null) {
                    if (typeof object.inbox !== "object")
                        throw TypeError(".email_client.ServerToClient.inbox: object expected");
                    message.inbox = $root.email_client.LoadInboxResponse.fromObject(object.inbox);
                }
                if (object.email != null) {
                    if (typeof object.email !== "object")
                        throw TypeError(".email_client.ServerToClient.email: object expected");
                    message.email = $root.email_client.LoadEmailResponse.fromObject(object.email);
                }
                if (object.attachment != null) {
                    if (typeof object.attachment !== "object")
                        throw TypeError(".email_client.ServerToClient.attachment: object expected");
                    message.attachment = $root.email_client.LoadAttachmentResponse.fromObject(object.attachment);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a ServerToClient message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.ServerToClient
             * @static
             * @param {email_client.ServerToClient} message ServerToClient
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerToClient.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.error != null && message.hasOwnProperty("error")) {
                    object.error = $root.email_client.Error.toObject(message.error, options);
                    if (options.oneofs)
                        object.message = "error";
                }
                if (message.authenticate != null && message.hasOwnProperty("authenticate")) {
                    object.authenticate = $root.email_client.AuthenticateResponse.toObject(message.authenticate, options);
                    if (options.oneofs)
                        object.message = "authenticate";
                }
                if (message.inbox != null && message.hasOwnProperty("inbox")) {
                    object.inbox = $root.email_client.LoadInboxResponse.toObject(message.inbox, options);
                    if (options.oneofs)
                        object.message = "inbox";
                }
                if (message.email != null && message.hasOwnProperty("email")) {
                    object.email = $root.email_client.LoadEmailResponse.toObject(message.email, options);
                    if (options.oneofs)
                        object.message = "email";
                }
                if (message.attachment != null && message.hasOwnProperty("attachment")) {
                    object.attachment = $root.email_client.LoadAttachmentResponse.toObject(message.attachment, options);
                    if (options.oneofs)
                        object.message = "attachment";
                }
                return object;
            };
    
            /**
             * Converts this ServerToClient to JSON.
             * @function toJSON
             * @memberof email_client.ServerToClient
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerToClient.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ServerToClient;
        })();
    
        email_client.Error = (function() {
    
            /**
             * Properties of an Error.
             * @memberof email_client
             * @interface IError
             * @property {string|null} [error] Error error
             */
    
            /**
             * Constructs a new Error.
             * @memberof email_client
             * @classdesc Represents an Error.
             * @implements IError
             * @constructor
             * @param {email_client.IError=} [properties] Properties to set
             */
            function Error(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Error error.
             * @member {string} error
             * @memberof email_client.Error
             * @instance
             */
            Error.prototype.error = "";
    
            /**
             * Creates a new Error instance using the specified properties.
             * @function create
             * @memberof email_client.Error
             * @static
             * @param {email_client.IError=} [properties] Properties to set
             * @returns {email_client.Error} Error instance
             */
            Error.create = function create(properties) {
                return new Error(properties);
            };
    
            /**
             * Encodes the specified Error message. Does not implicitly {@link email_client.Error.verify|verify} messages.
             * @function encode
             * @memberof email_client.Error
             * @static
             * @param {email_client.IError} message Error message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Error.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.error != null && message.hasOwnProperty("error"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.error);
                return writer;
            };
    
            /**
             * Encodes the specified Error message, length delimited. Does not implicitly {@link email_client.Error.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.Error
             * @static
             * @param {email_client.IError} message Error message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Error.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an Error message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.Error
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.Error} Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Error.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.Error();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.error = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an Error message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.Error
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.Error} Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Error.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an Error message.
             * @function verify
             * @memberof email_client.Error
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Error.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.error != null && message.hasOwnProperty("error"))
                    if (!$util.isString(message.error))
                        return "error: string expected";
                return null;
            };
    
            /**
             * Creates an Error message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.Error
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.Error} Error
             */
            Error.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.Error)
                    return object;
                var message = new $root.email_client.Error();
                if (object.error != null)
                    message.error = String(object.error);
                return message;
            };
    
            /**
             * Creates a plain object from an Error message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.Error
             * @static
             * @param {email_client.Error} message Error
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Error.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.error = "";
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = message.error;
                return object;
            };
    
            /**
             * Converts this Error to JSON.
             * @function toJSON
             * @memberof email_client.Error
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Error.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Error;
        })();
    
        email_client.AttachmentHeader = (function() {
    
            /**
             * Properties of an AttachmentHeader.
             * @memberof email_client
             * @interface IAttachmentHeader
             * @property {string|null} [id] AttachmentHeader id
             * @property {string|null} [mimeType] AttachmentHeader mimeType
             * @property {string|null} [name] AttachmentHeader name
             * @property {string|null} [contentId] AttachmentHeader contentId
             */
    
            /**
             * Constructs a new AttachmentHeader.
             * @memberof email_client
             * @classdesc Represents an AttachmentHeader.
             * @implements IAttachmentHeader
             * @constructor
             * @param {email_client.IAttachmentHeader=} [properties] Properties to set
             */
            function AttachmentHeader(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AttachmentHeader id.
             * @member {string} id
             * @memberof email_client.AttachmentHeader
             * @instance
             */
            AttachmentHeader.prototype.id = "";
    
            /**
             * AttachmentHeader mimeType.
             * @member {string} mimeType
             * @memberof email_client.AttachmentHeader
             * @instance
             */
            AttachmentHeader.prototype.mimeType = "";
    
            /**
             * AttachmentHeader name.
             * @member {string} name
             * @memberof email_client.AttachmentHeader
             * @instance
             */
            AttachmentHeader.prototype.name = "";
    
            /**
             * AttachmentHeader contentId.
             * @member {string} contentId
             * @memberof email_client.AttachmentHeader
             * @instance
             */
            AttachmentHeader.prototype.contentId = "";
    
            /**
             * Creates a new AttachmentHeader instance using the specified properties.
             * @function create
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {email_client.IAttachmentHeader=} [properties] Properties to set
             * @returns {email_client.AttachmentHeader} AttachmentHeader instance
             */
            AttachmentHeader.create = function create(properties) {
                return new AttachmentHeader(properties);
            };
    
            /**
             * Encodes the specified AttachmentHeader message. Does not implicitly {@link email_client.AttachmentHeader.verify|verify} messages.
             * @function encode
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {email_client.IAttachmentHeader} message AttachmentHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AttachmentHeader.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.mimeType);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.contentId);
                return writer;
            };
    
            /**
             * Encodes the specified AttachmentHeader message, length delimited. Does not implicitly {@link email_client.AttachmentHeader.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {email_client.IAttachmentHeader} message AttachmentHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AttachmentHeader.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AttachmentHeader message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.AttachmentHeader} AttachmentHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttachmentHeader.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.AttachmentHeader();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.mimeType = reader.string();
                        break;
                    case 3:
                        message.name = reader.string();
                        break;
                    case 4:
                        message.contentId = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AttachmentHeader message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.AttachmentHeader} AttachmentHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttachmentHeader.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AttachmentHeader message.
             * @function verify
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AttachmentHeader.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    if (!$util.isString(message.mimeType))
                        return "mimeType: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    if (!$util.isString(message.contentId))
                        return "contentId: string expected";
                return null;
            };
    
            /**
             * Creates an AttachmentHeader message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.AttachmentHeader} AttachmentHeader
             */
            AttachmentHeader.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.AttachmentHeader)
                    return object;
                var message = new $root.email_client.AttachmentHeader();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.mimeType != null)
                    message.mimeType = String(object.mimeType);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.contentId != null)
                    message.contentId = String(object.contentId);
                return message;
            };
    
            /**
             * Creates a plain object from an AttachmentHeader message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.AttachmentHeader
             * @static
             * @param {email_client.AttachmentHeader} message AttachmentHeader
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AttachmentHeader.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.id = "";
                    object.mimeType = "";
                    object.name = "";
                    object.contentId = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    object.mimeType = message.mimeType;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    object.contentId = message.contentId;
                return object;
            };
    
            /**
             * Converts this AttachmentHeader to JSON.
             * @function toJSON
             * @memberof email_client.AttachmentHeader
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AttachmentHeader.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AttachmentHeader;
        })();
    
        email_client.LoadAttachmentRequest = (function() {
    
            /**
             * Properties of a LoadAttachmentRequest.
             * @memberof email_client
             * @interface ILoadAttachmentRequest
             * @property {string|null} [id] LoadAttachmentRequest id
             */
    
            /**
             * Constructs a new LoadAttachmentRequest.
             * @memberof email_client
             * @classdesc Represents a LoadAttachmentRequest.
             * @implements ILoadAttachmentRequest
             * @constructor
             * @param {email_client.ILoadAttachmentRequest=} [properties] Properties to set
             */
            function LoadAttachmentRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadAttachmentRequest id.
             * @member {string} id
             * @memberof email_client.LoadAttachmentRequest
             * @instance
             */
            LoadAttachmentRequest.prototype.id = "";
    
            /**
             * Creates a new LoadAttachmentRequest instance using the specified properties.
             * @function create
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {email_client.ILoadAttachmentRequest=} [properties] Properties to set
             * @returns {email_client.LoadAttachmentRequest} LoadAttachmentRequest instance
             */
            LoadAttachmentRequest.create = function create(properties) {
                return new LoadAttachmentRequest(properties);
            };
    
            /**
             * Encodes the specified LoadAttachmentRequest message. Does not implicitly {@link email_client.LoadAttachmentRequest.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {email_client.ILoadAttachmentRequest} message LoadAttachmentRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadAttachmentRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                return writer;
            };
    
            /**
             * Encodes the specified LoadAttachmentRequest message, length delimited. Does not implicitly {@link email_client.LoadAttachmentRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {email_client.ILoadAttachmentRequest} message LoadAttachmentRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadAttachmentRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadAttachmentRequest message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadAttachmentRequest} LoadAttachmentRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadAttachmentRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadAttachmentRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadAttachmentRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadAttachmentRequest} LoadAttachmentRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadAttachmentRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadAttachmentRequest message.
             * @function verify
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadAttachmentRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                return null;
            };
    
            /**
             * Creates a LoadAttachmentRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadAttachmentRequest} LoadAttachmentRequest
             */
            LoadAttachmentRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadAttachmentRequest)
                    return object;
                var message = new $root.email_client.LoadAttachmentRequest();
                if (object.id != null)
                    message.id = String(object.id);
                return message;
            };
    
            /**
             * Creates a plain object from a LoadAttachmentRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadAttachmentRequest
             * @static
             * @param {email_client.LoadAttachmentRequest} message LoadAttachmentRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadAttachmentRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.id = "";
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };
    
            /**
             * Converts this LoadAttachmentRequest to JSON.
             * @function toJSON
             * @memberof email_client.LoadAttachmentRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadAttachmentRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadAttachmentRequest;
        })();
    
        email_client.LoadAttachmentResponse = (function() {
    
            /**
             * Properties of a LoadAttachmentResponse.
             * @memberof email_client
             * @interface ILoadAttachmentResponse
             * @property {string|null} [id] LoadAttachmentResponse id
             * @property {Object.<string,string>|null} [headers] LoadAttachmentResponse headers
             * @property {string|null} [mimeType] LoadAttachmentResponse mimeType
             * @property {string|null} [name] LoadAttachmentResponse name
             * @property {string|null} [contentId] LoadAttachmentResponse contentId
             * @property {Uint8Array|null} [contents] LoadAttachmentResponse contents
             */
    
            /**
             * Constructs a new LoadAttachmentResponse.
             * @memberof email_client
             * @classdesc Represents a LoadAttachmentResponse.
             * @implements ILoadAttachmentResponse
             * @constructor
             * @param {email_client.ILoadAttachmentResponse=} [properties] Properties to set
             */
            function LoadAttachmentResponse(properties) {
                this.headers = {};
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadAttachmentResponse id.
             * @member {string} id
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.id = "";
    
            /**
             * LoadAttachmentResponse headers.
             * @member {Object.<string,string>} headers
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.headers = $util.emptyObject;
    
            /**
             * LoadAttachmentResponse mimeType.
             * @member {string} mimeType
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.mimeType = "";
    
            /**
             * LoadAttachmentResponse name.
             * @member {string} name
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.name = "";
    
            /**
             * LoadAttachmentResponse contentId.
             * @member {string} contentId
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.contentId = "";
    
            /**
             * LoadAttachmentResponse contents.
             * @member {Uint8Array} contents
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             */
            LoadAttachmentResponse.prototype.contents = $util.newBuffer([]);
    
            /**
             * Creates a new LoadAttachmentResponse instance using the specified properties.
             * @function create
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {email_client.ILoadAttachmentResponse=} [properties] Properties to set
             * @returns {email_client.LoadAttachmentResponse} LoadAttachmentResponse instance
             */
            LoadAttachmentResponse.create = function create(properties) {
                return new LoadAttachmentResponse(properties);
            };
    
            /**
             * Encodes the specified LoadAttachmentResponse message. Does not implicitly {@link email_client.LoadAttachmentResponse.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {email_client.ILoadAttachmentResponse} message LoadAttachmentResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadAttachmentResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.headers != null && message.hasOwnProperty("headers"))
                    for (var keys = Object.keys(message.headers), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.headers[keys[i]]).ldelim();
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.mimeType);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.name);
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.contentId);
                if (message.contents != null && message.hasOwnProperty("contents"))
                    writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.contents);
                return writer;
            };
    
            /**
             * Encodes the specified LoadAttachmentResponse message, length delimited. Does not implicitly {@link email_client.LoadAttachmentResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {email_client.ILoadAttachmentResponse} message LoadAttachmentResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadAttachmentResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadAttachmentResponse message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadAttachmentResponse} LoadAttachmentResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadAttachmentResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadAttachmentResponse(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        reader.skip().pos++;
                        if (message.headers === $util.emptyObject)
                            message.headers = {};
                        key = reader.string();
                        reader.pos++;
                        message.headers[key] = reader.string();
                        break;
                    case 3:
                        message.mimeType = reader.string();
                        break;
                    case 4:
                        message.name = reader.string();
                        break;
                    case 5:
                        message.contentId = reader.string();
                        break;
                    case 6:
                        message.contents = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadAttachmentResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadAttachmentResponse} LoadAttachmentResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadAttachmentResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadAttachmentResponse message.
             * @function verify
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadAttachmentResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    if (!$util.isObject(message.headers))
                        return "headers: object expected";
                    var key = Object.keys(message.headers);
                    for (var i = 0; i < key.length; ++i)
                        if (!$util.isString(message.headers[key[i]]))
                            return "headers: string{k:string} expected";
                }
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    if (!$util.isString(message.mimeType))
                        return "mimeType: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    if (!$util.isString(message.contentId))
                        return "contentId: string expected";
                if (message.contents != null && message.hasOwnProperty("contents"))
                    if (!(message.contents && typeof message.contents.length === "number" || $util.isString(message.contents)))
                        return "contents: buffer expected";
                return null;
            };
    
            /**
             * Creates a LoadAttachmentResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadAttachmentResponse} LoadAttachmentResponse
             */
            LoadAttachmentResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadAttachmentResponse)
                    return object;
                var message = new $root.email_client.LoadAttachmentResponse();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.headers) {
                    if (typeof object.headers !== "object")
                        throw TypeError(".email_client.LoadAttachmentResponse.headers: object expected");
                    message.headers = {};
                    for (var keys = Object.keys(object.headers), i = 0; i < keys.length; ++i)
                        message.headers[keys[i]] = String(object.headers[keys[i]]);
                }
                if (object.mimeType != null)
                    message.mimeType = String(object.mimeType);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.contentId != null)
                    message.contentId = String(object.contentId);
                if (object.contents != null)
                    if (typeof object.contents === "string")
                        $util.base64.decode(object.contents, message.contents = $util.newBuffer($util.base64.length(object.contents)), 0);
                    else if (object.contents.length)
                        message.contents = object.contents;
                return message;
            };
    
            /**
             * Creates a plain object from a LoadAttachmentResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadAttachmentResponse
             * @static
             * @param {email_client.LoadAttachmentResponse} message LoadAttachmentResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadAttachmentResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.objects || options.defaults)
                    object.headers = {};
                if (options.defaults) {
                    object.id = "";
                    object.mimeType = "";
                    object.name = "";
                    object.contentId = "";
                    if (options.bytes === String)
                        object.contents = "";
                    else {
                        object.contents = [];
                        if (options.bytes !== Array)
                            object.contents = $util.newBuffer(object.contents);
                    }
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                var keys2;
                if (message.headers && (keys2 = Object.keys(message.headers)).length) {
                    object.headers = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.headers[keys2[j]] = message.headers[keys2[j]];
                }
                if (message.mimeType != null && message.hasOwnProperty("mimeType"))
                    object.mimeType = message.mimeType;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.contentId != null && message.hasOwnProperty("contentId"))
                    object.contentId = message.contentId;
                if (message.contents != null && message.hasOwnProperty("contents"))
                    object.contents = options.bytes === String ? $util.base64.encode(message.contents, 0, message.contents.length) : options.bytes === Array ? Array.prototype.slice.call(message.contents) : message.contents;
                return object;
            };
    
            /**
             * Converts this LoadAttachmentResponse to JSON.
             * @function toJSON
             * @memberof email_client.LoadAttachmentResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadAttachmentResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadAttachmentResponse;
        })();
    
        email_client.AuthenticateRequest = (function() {
    
            /**
             * Properties of an AuthenticateRequest.
             * @memberof email_client
             * @interface IAuthenticateRequest
             * @property {string|null} [username] AuthenticateRequest username
             * @property {string|null} [password] AuthenticateRequest password
             */
    
            /**
             * Constructs a new AuthenticateRequest.
             * @memberof email_client
             * @classdesc Represents an AuthenticateRequest.
             * @implements IAuthenticateRequest
             * @constructor
             * @param {email_client.IAuthenticateRequest=} [properties] Properties to set
             */
            function AuthenticateRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AuthenticateRequest username.
             * @member {string} username
             * @memberof email_client.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.username = "";
    
            /**
             * AuthenticateRequest password.
             * @member {string} password
             * @memberof email_client.AuthenticateRequest
             * @instance
             */
            AuthenticateRequest.prototype.password = "";
    
            /**
             * Creates a new AuthenticateRequest instance using the specified properties.
             * @function create
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {email_client.IAuthenticateRequest=} [properties] Properties to set
             * @returns {email_client.AuthenticateRequest} AuthenticateRequest instance
             */
            AuthenticateRequest.create = function create(properties) {
                return new AuthenticateRequest(properties);
            };
    
            /**
             * Encodes the specified AuthenticateRequest message. Does not implicitly {@link email_client.AuthenticateRequest.verify|verify} messages.
             * @function encode
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {email_client.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.username != null && message.hasOwnProperty("username"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
                if (message.password != null && message.hasOwnProperty("password"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
                return writer;
            };
    
            /**
             * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link email_client.AuthenticateRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {email_client.IAuthenticateRequest} message AuthenticateRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.AuthenticateRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.username = reader.string();
                        break;
                    case 2:
                        message.password = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.AuthenticateRequest} AuthenticateRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AuthenticateRequest message.
             * @function verify
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.username != null && message.hasOwnProperty("username"))
                    if (!$util.isString(message.username))
                        return "username: string expected";
                if (message.password != null && message.hasOwnProperty("password"))
                    if (!$util.isString(message.password))
                        return "password: string expected";
                return null;
            };
    
            /**
             * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.AuthenticateRequest} AuthenticateRequest
             */
            AuthenticateRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.AuthenticateRequest)
                    return object;
                var message = new $root.email_client.AuthenticateRequest();
                if (object.username != null)
                    message.username = String(object.username);
                if (object.password != null)
                    message.password = String(object.password);
                return message;
            };
    
            /**
             * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.AuthenticateRequest
             * @static
             * @param {email_client.AuthenticateRequest} message AuthenticateRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.username = "";
                    object.password = "";
                }
                if (message.username != null && message.hasOwnProperty("username"))
                    object.username = message.username;
                if (message.password != null && message.hasOwnProperty("password"))
                    object.password = message.password;
                return object;
            };
    
            /**
             * Converts this AuthenticateRequest to JSON.
             * @function toJSON
             * @memberof email_client.AuthenticateRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AuthenticateRequest;
        })();
    
        email_client.AuthenticateResponse = (function() {
    
            /**
             * Properties of an AuthenticateResponse.
             * @memberof email_client
             * @interface IAuthenticateResponse
             * @property {boolean|null} [success] AuthenticateResponse success
             * @property {Array.<email_client.IInboxHeader>|null} [inboxes] AuthenticateResponse inboxes
             */
    
            /**
             * Constructs a new AuthenticateResponse.
             * @memberof email_client
             * @classdesc Represents an AuthenticateResponse.
             * @implements IAuthenticateResponse
             * @constructor
             * @param {email_client.IAuthenticateResponse=} [properties] Properties to set
             */
            function AuthenticateResponse(properties) {
                this.inboxes = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * AuthenticateResponse success.
             * @member {boolean} success
             * @memberof email_client.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.success = false;
    
            /**
             * AuthenticateResponse inboxes.
             * @member {Array.<email_client.IInboxHeader>} inboxes
             * @memberof email_client.AuthenticateResponse
             * @instance
             */
            AuthenticateResponse.prototype.inboxes = $util.emptyArray;
    
            /**
             * Creates a new AuthenticateResponse instance using the specified properties.
             * @function create
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {email_client.IAuthenticateResponse=} [properties] Properties to set
             * @returns {email_client.AuthenticateResponse} AuthenticateResponse instance
             */
            AuthenticateResponse.create = function create(properties) {
                return new AuthenticateResponse(properties);
            };
    
            /**
             * Encodes the specified AuthenticateResponse message. Does not implicitly {@link email_client.AuthenticateResponse.verify|verify} messages.
             * @function encode
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {email_client.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.success != null && message.hasOwnProperty("success"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
                if (message.inboxes != null && message.inboxes.length)
                    for (var i = 0; i < message.inboxes.length; ++i)
                        $root.email_client.InboxHeader.encode(message.inboxes[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link email_client.AuthenticateResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {email_client.IAuthenticateResponse} message AuthenticateResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AuthenticateResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.AuthenticateResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.success = reader.bool();
                        break;
                    case 2:
                        if (!(message.inboxes && message.inboxes.length))
                            message.inboxes = [];
                        message.inboxes.push($root.email_client.InboxHeader.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.AuthenticateResponse} AuthenticateResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AuthenticateResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an AuthenticateResponse message.
             * @function verify
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AuthenticateResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.success != null && message.hasOwnProperty("success"))
                    if (typeof message.success !== "boolean")
                        return "success: boolean expected";
                if (message.inboxes != null && message.hasOwnProperty("inboxes")) {
                    if (!Array.isArray(message.inboxes))
                        return "inboxes: array expected";
                    for (var i = 0; i < message.inboxes.length; ++i) {
                        var error = $root.email_client.InboxHeader.verify(message.inboxes[i]);
                        if (error)
                            return "inboxes." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates an AuthenticateResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.AuthenticateResponse} AuthenticateResponse
             */
            AuthenticateResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.AuthenticateResponse)
                    return object;
                var message = new $root.email_client.AuthenticateResponse();
                if (object.success != null)
                    message.success = Boolean(object.success);
                if (object.inboxes) {
                    if (!Array.isArray(object.inboxes))
                        throw TypeError(".email_client.AuthenticateResponse.inboxes: array expected");
                    message.inboxes = [];
                    for (var i = 0; i < object.inboxes.length; ++i) {
                        if (typeof object.inboxes[i] !== "object")
                            throw TypeError(".email_client.AuthenticateResponse.inboxes: object expected");
                        message.inboxes[i] = $root.email_client.InboxHeader.fromObject(object.inboxes[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from an AuthenticateResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.AuthenticateResponse
             * @static
             * @param {email_client.AuthenticateResponse} message AuthenticateResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AuthenticateResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.inboxes = [];
                if (options.defaults)
                    object.success = false;
                if (message.success != null && message.hasOwnProperty("success"))
                    object.success = message.success;
                if (message.inboxes && message.inboxes.length) {
                    object.inboxes = [];
                    for (var j = 0; j < message.inboxes.length; ++j)
                        object.inboxes[j] = $root.email_client.InboxHeader.toObject(message.inboxes[j], options);
                }
                return object;
            };
    
            /**
             * Converts this AuthenticateResponse to JSON.
             * @function toJSON
             * @memberof email_client.AuthenticateResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AuthenticateResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return AuthenticateResponse;
        })();
    
        email_client.InboxHeader = (function() {
    
            /**
             * Properties of an InboxHeader.
             * @memberof email_client
             * @interface IInboxHeader
             * @property {string|null} [id] InboxHeader id
             * @property {string|null} [name] InboxHeader name
             * @property {number|null} [unreadCount] InboxHeader unreadCount
             */
    
            /**
             * Constructs a new InboxHeader.
             * @memberof email_client
             * @classdesc Represents an InboxHeader.
             * @implements IInboxHeader
             * @constructor
             * @param {email_client.IInboxHeader=} [properties] Properties to set
             */
            function InboxHeader(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * InboxHeader id.
             * @member {string} id
             * @memberof email_client.InboxHeader
             * @instance
             */
            InboxHeader.prototype.id = "";
    
            /**
             * InboxHeader name.
             * @member {string} name
             * @memberof email_client.InboxHeader
             * @instance
             */
            InboxHeader.prototype.name = "";
    
            /**
             * InboxHeader unreadCount.
             * @member {number} unreadCount
             * @memberof email_client.InboxHeader
             * @instance
             */
            InboxHeader.prototype.unreadCount = 0;
    
            /**
             * Creates a new InboxHeader instance using the specified properties.
             * @function create
             * @memberof email_client.InboxHeader
             * @static
             * @param {email_client.IInboxHeader=} [properties] Properties to set
             * @returns {email_client.InboxHeader} InboxHeader instance
             */
            InboxHeader.create = function create(properties) {
                return new InboxHeader(properties);
            };
    
            /**
             * Encodes the specified InboxHeader message. Does not implicitly {@link email_client.InboxHeader.verify|verify} messages.
             * @function encode
             * @memberof email_client.InboxHeader
             * @static
             * @param {email_client.IInboxHeader} message InboxHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InboxHeader.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.unreadCount);
                return writer;
            };
    
            /**
             * Encodes the specified InboxHeader message, length delimited. Does not implicitly {@link email_client.InboxHeader.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.InboxHeader
             * @static
             * @param {email_client.IInboxHeader} message InboxHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InboxHeader.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an InboxHeader message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.InboxHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.InboxHeader} InboxHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InboxHeader.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.InboxHeader();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 4:
                        message.unreadCount = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an InboxHeader message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.InboxHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.InboxHeader} InboxHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InboxHeader.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an InboxHeader message.
             * @function verify
             * @memberof email_client.InboxHeader
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InboxHeader.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    if (!$util.isInteger(message.unreadCount))
                        return "unreadCount: integer expected";
                return null;
            };
    
            /**
             * Creates an InboxHeader message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.InboxHeader
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.InboxHeader} InboxHeader
             */
            InboxHeader.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.InboxHeader)
                    return object;
                var message = new $root.email_client.InboxHeader();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.unreadCount != null)
                    message.unreadCount = object.unreadCount | 0;
                return message;
            };
    
            /**
             * Creates a plain object from an InboxHeader message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.InboxHeader
             * @static
             * @param {email_client.InboxHeader} message InboxHeader
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InboxHeader.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.unreadCount = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    object.unreadCount = message.unreadCount;
                return object;
            };
    
            /**
             * Converts this InboxHeader to JSON.
             * @function toJSON
             * @memberof email_client.InboxHeader
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InboxHeader.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return InboxHeader;
        })();
    
        email_client.LoadInboxRequest = (function() {
    
            /**
             * Properties of a LoadInboxRequest.
             * @memberof email_client
             * @interface ILoadInboxRequest
             * @property {string|null} [id] LoadInboxRequest id
             */
    
            /**
             * Constructs a new LoadInboxRequest.
             * @memberof email_client
             * @classdesc Represents a LoadInboxRequest.
             * @implements ILoadInboxRequest
             * @constructor
             * @param {email_client.ILoadInboxRequest=} [properties] Properties to set
             */
            function LoadInboxRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadInboxRequest id.
             * @member {string} id
             * @memberof email_client.LoadInboxRequest
             * @instance
             */
            LoadInboxRequest.prototype.id = "";
    
            /**
             * Creates a new LoadInboxRequest instance using the specified properties.
             * @function create
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {email_client.ILoadInboxRequest=} [properties] Properties to set
             * @returns {email_client.LoadInboxRequest} LoadInboxRequest instance
             */
            LoadInboxRequest.create = function create(properties) {
                return new LoadInboxRequest(properties);
            };
    
            /**
             * Encodes the specified LoadInboxRequest message. Does not implicitly {@link email_client.LoadInboxRequest.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {email_client.ILoadInboxRequest} message LoadInboxRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadInboxRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                return writer;
            };
    
            /**
             * Encodes the specified LoadInboxRequest message, length delimited. Does not implicitly {@link email_client.LoadInboxRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {email_client.ILoadInboxRequest} message LoadInboxRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadInboxRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadInboxRequest message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadInboxRequest} LoadInboxRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadInboxRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadInboxRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadInboxRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadInboxRequest} LoadInboxRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadInboxRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadInboxRequest message.
             * @function verify
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadInboxRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                return null;
            };
    
            /**
             * Creates a LoadInboxRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadInboxRequest} LoadInboxRequest
             */
            LoadInboxRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadInboxRequest)
                    return object;
                var message = new $root.email_client.LoadInboxRequest();
                if (object.id != null)
                    message.id = String(object.id);
                return message;
            };
    
            /**
             * Creates a plain object from a LoadInboxRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadInboxRequest
             * @static
             * @param {email_client.LoadInboxRequest} message LoadInboxRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadInboxRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.id = "";
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };
    
            /**
             * Converts this LoadInboxRequest to JSON.
             * @function toJSON
             * @memberof email_client.LoadInboxRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadInboxRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadInboxRequest;
        })();
    
        email_client.LoadInboxResponse = (function() {
    
            /**
             * Properties of a LoadInboxResponse.
             * @memberof email_client
             * @interface ILoadInboxResponse
             * @property {string|null} [id] LoadInboxResponse id
             * @property {string|null} [name] LoadInboxResponse name
             * @property {Array.<string>|null} [addresses] LoadInboxResponse addresses
             * @property {number|null} [unreadCount] LoadInboxResponse unreadCount
             * @property {Array.<email_client.IEmailHeader>|null} [emails] LoadInboxResponse emails
             */
    
            /**
             * Constructs a new LoadInboxResponse.
             * @memberof email_client
             * @classdesc Represents a LoadInboxResponse.
             * @implements ILoadInboxResponse
             * @constructor
             * @param {email_client.ILoadInboxResponse=} [properties] Properties to set
             */
            function LoadInboxResponse(properties) {
                this.addresses = [];
                this.emails = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadInboxResponse id.
             * @member {string} id
             * @memberof email_client.LoadInboxResponse
             * @instance
             */
            LoadInboxResponse.prototype.id = "";
    
            /**
             * LoadInboxResponse name.
             * @member {string} name
             * @memberof email_client.LoadInboxResponse
             * @instance
             */
            LoadInboxResponse.prototype.name = "";
    
            /**
             * LoadInboxResponse addresses.
             * @member {Array.<string>} addresses
             * @memberof email_client.LoadInboxResponse
             * @instance
             */
            LoadInboxResponse.prototype.addresses = $util.emptyArray;
    
            /**
             * LoadInboxResponse unreadCount.
             * @member {number} unreadCount
             * @memberof email_client.LoadInboxResponse
             * @instance
             */
            LoadInboxResponse.prototype.unreadCount = 0;
    
            /**
             * LoadInboxResponse emails.
             * @member {Array.<email_client.IEmailHeader>} emails
             * @memberof email_client.LoadInboxResponse
             * @instance
             */
            LoadInboxResponse.prototype.emails = $util.emptyArray;
    
            /**
             * Creates a new LoadInboxResponse instance using the specified properties.
             * @function create
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {email_client.ILoadInboxResponse=} [properties] Properties to set
             * @returns {email_client.LoadInboxResponse} LoadInboxResponse instance
             */
            LoadInboxResponse.create = function create(properties) {
                return new LoadInboxResponse(properties);
            };
    
            /**
             * Encodes the specified LoadInboxResponse message. Does not implicitly {@link email_client.LoadInboxResponse.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {email_client.ILoadInboxResponse} message LoadInboxResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadInboxResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.addresses != null && message.addresses.length)
                    for (var i = 0; i < message.addresses.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.addresses[i]);
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.unreadCount);
                if (message.emails != null && message.emails.length)
                    for (var i = 0; i < message.emails.length; ++i)
                        $root.email_client.EmailHeader.encode(message.emails[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified LoadInboxResponse message, length delimited. Does not implicitly {@link email_client.LoadInboxResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {email_client.ILoadInboxResponse} message LoadInboxResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadInboxResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadInboxResponse message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadInboxResponse} LoadInboxResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadInboxResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadInboxResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        if (!(message.addresses && message.addresses.length))
                            message.addresses = [];
                        message.addresses.push(reader.string());
                        break;
                    case 4:
                        message.unreadCount = reader.int32();
                        break;
                    case 5:
                        if (!(message.emails && message.emails.length))
                            message.emails = [];
                        message.emails.push($root.email_client.EmailHeader.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadInboxResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadInboxResponse} LoadInboxResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadInboxResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadInboxResponse message.
             * @function verify
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadInboxResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.addresses != null && message.hasOwnProperty("addresses")) {
                    if (!Array.isArray(message.addresses))
                        return "addresses: array expected";
                    for (var i = 0; i < message.addresses.length; ++i)
                        if (!$util.isString(message.addresses[i]))
                            return "addresses: string[] expected";
                }
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    if (!$util.isInteger(message.unreadCount))
                        return "unreadCount: integer expected";
                if (message.emails != null && message.hasOwnProperty("emails")) {
                    if (!Array.isArray(message.emails))
                        return "emails: array expected";
                    for (var i = 0; i < message.emails.length; ++i) {
                        var error = $root.email_client.EmailHeader.verify(message.emails[i]);
                        if (error)
                            return "emails." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a LoadInboxResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadInboxResponse} LoadInboxResponse
             */
            LoadInboxResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadInboxResponse)
                    return object;
                var message = new $root.email_client.LoadInboxResponse();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.addresses) {
                    if (!Array.isArray(object.addresses))
                        throw TypeError(".email_client.LoadInboxResponse.addresses: array expected");
                    message.addresses = [];
                    for (var i = 0; i < object.addresses.length; ++i)
                        message.addresses[i] = String(object.addresses[i]);
                }
                if (object.unreadCount != null)
                    message.unreadCount = object.unreadCount | 0;
                if (object.emails) {
                    if (!Array.isArray(object.emails))
                        throw TypeError(".email_client.LoadInboxResponse.emails: array expected");
                    message.emails = [];
                    for (var i = 0; i < object.emails.length; ++i) {
                        if (typeof object.emails[i] !== "object")
                            throw TypeError(".email_client.LoadInboxResponse.emails: object expected");
                        message.emails[i] = $root.email_client.EmailHeader.fromObject(object.emails[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a LoadInboxResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadInboxResponse
             * @static
             * @param {email_client.LoadInboxResponse} message LoadInboxResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadInboxResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.addresses = [];
                    object.emails = [];
                }
                if (options.defaults) {
                    object.id = "";
                    object.name = "";
                    object.unreadCount = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.addresses && message.addresses.length) {
                    object.addresses = [];
                    for (var j = 0; j < message.addresses.length; ++j)
                        object.addresses[j] = message.addresses[j];
                }
                if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                    object.unreadCount = message.unreadCount;
                if (message.emails && message.emails.length) {
                    object.emails = [];
                    for (var j = 0; j < message.emails.length; ++j)
                        object.emails[j] = $root.email_client.EmailHeader.toObject(message.emails[j], options);
                }
                return object;
            };
    
            /**
             * Converts this LoadInboxResponse to JSON.
             * @function toJSON
             * @memberof email_client.LoadInboxResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadInboxResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadInboxResponse;
        })();
    
        email_client.EmailHeader = (function() {
    
            /**
             * Properties of an EmailHeader.
             * @memberof email_client
             * @interface IEmailHeader
             * @property {string|null} [id] EmailHeader id
             * @property {string|null} [inboxId] EmailHeader inboxId
             * @property {string|null} [from] EmailHeader from
             * @property {string|null} [to] EmailHeader to
             * @property {string|null} [subject] EmailHeader subject
             * @property {boolean|null} [read] EmailHeader read
             */
    
            /**
             * Constructs a new EmailHeader.
             * @memberof email_client
             * @classdesc Represents an EmailHeader.
             * @implements IEmailHeader
             * @constructor
             * @param {email_client.IEmailHeader=} [properties] Properties to set
             */
            function EmailHeader(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * EmailHeader id.
             * @member {string} id
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.id = "";
    
            /**
             * EmailHeader inboxId.
             * @member {string} inboxId
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.inboxId = "";
    
            /**
             * EmailHeader from.
             * @member {string} from
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.from = "";
    
            /**
             * EmailHeader to.
             * @member {string} to
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.to = "";
    
            /**
             * EmailHeader subject.
             * @member {string} subject
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.subject = "";
    
            /**
             * EmailHeader read.
             * @member {boolean} read
             * @memberof email_client.EmailHeader
             * @instance
             */
            EmailHeader.prototype.read = false;
    
            /**
             * Creates a new EmailHeader instance using the specified properties.
             * @function create
             * @memberof email_client.EmailHeader
             * @static
             * @param {email_client.IEmailHeader=} [properties] Properties to set
             * @returns {email_client.EmailHeader} EmailHeader instance
             */
            EmailHeader.create = function create(properties) {
                return new EmailHeader(properties);
            };
    
            /**
             * Encodes the specified EmailHeader message. Does not implicitly {@link email_client.EmailHeader.verify|verify} messages.
             * @function encode
             * @memberof email_client.EmailHeader
             * @static
             * @param {email_client.IEmailHeader} message EmailHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EmailHeader.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.inboxId);
                if (message.from != null && message.hasOwnProperty("from"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.from);
                if (message.to != null && message.hasOwnProperty("to"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.to);
                if (message.subject != null && message.hasOwnProperty("subject"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.subject);
                if (message.read != null && message.hasOwnProperty("read"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.read);
                return writer;
            };
    
            /**
             * Encodes the specified EmailHeader message, length delimited. Does not implicitly {@link email_client.EmailHeader.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.EmailHeader
             * @static
             * @param {email_client.IEmailHeader} message EmailHeader message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            EmailHeader.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an EmailHeader message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.EmailHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.EmailHeader} EmailHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EmailHeader.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.EmailHeader();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.inboxId = reader.string();
                        break;
                    case 3:
                        message.from = reader.string();
                        break;
                    case 4:
                        message.to = reader.string();
                        break;
                    case 5:
                        message.subject = reader.string();
                        break;
                    case 6:
                        message.read = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an EmailHeader message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.EmailHeader
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.EmailHeader} EmailHeader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            EmailHeader.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an EmailHeader message.
             * @function verify
             * @memberof email_client.EmailHeader
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            EmailHeader.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    if (!$util.isString(message.inboxId))
                        return "inboxId: string expected";
                if (message.from != null && message.hasOwnProperty("from"))
                    if (!$util.isString(message.from))
                        return "from: string expected";
                if (message.to != null && message.hasOwnProperty("to"))
                    if (!$util.isString(message.to))
                        return "to: string expected";
                if (message.subject != null && message.hasOwnProperty("subject"))
                    if (!$util.isString(message.subject))
                        return "subject: string expected";
                if (message.read != null && message.hasOwnProperty("read"))
                    if (typeof message.read !== "boolean")
                        return "read: boolean expected";
                return null;
            };
    
            /**
             * Creates an EmailHeader message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.EmailHeader
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.EmailHeader} EmailHeader
             */
            EmailHeader.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.EmailHeader)
                    return object;
                var message = new $root.email_client.EmailHeader();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.inboxId != null)
                    message.inboxId = String(object.inboxId);
                if (object.from != null)
                    message.from = String(object.from);
                if (object.to != null)
                    message.to = String(object.to);
                if (object.subject != null)
                    message.subject = String(object.subject);
                if (object.read != null)
                    message.read = Boolean(object.read);
                return message;
            };
    
            /**
             * Creates a plain object from an EmailHeader message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.EmailHeader
             * @static
             * @param {email_client.EmailHeader} message EmailHeader
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            EmailHeader.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.id = "";
                    object.inboxId = "";
                    object.from = "";
                    object.to = "";
                    object.subject = "";
                    object.read = false;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    object.inboxId = message.inboxId;
                if (message.from != null && message.hasOwnProperty("from"))
                    object.from = message.from;
                if (message.to != null && message.hasOwnProperty("to"))
                    object.to = message.to;
                if (message.subject != null && message.hasOwnProperty("subject"))
                    object.subject = message.subject;
                if (message.read != null && message.hasOwnProperty("read"))
                    object.read = message.read;
                return object;
            };
    
            /**
             * Converts this EmailHeader to JSON.
             * @function toJSON
             * @memberof email_client.EmailHeader
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            EmailHeader.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return EmailHeader;
        })();
    
        email_client.LoadEmailRequest = (function() {
    
            /**
             * Properties of a LoadEmailRequest.
             * @memberof email_client
             * @interface ILoadEmailRequest
             * @property {string|null} [id] LoadEmailRequest id
             */
    
            /**
             * Constructs a new LoadEmailRequest.
             * @memberof email_client
             * @classdesc Represents a LoadEmailRequest.
             * @implements ILoadEmailRequest
             * @constructor
             * @param {email_client.ILoadEmailRequest=} [properties] Properties to set
             */
            function LoadEmailRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadEmailRequest id.
             * @member {string} id
             * @memberof email_client.LoadEmailRequest
             * @instance
             */
            LoadEmailRequest.prototype.id = "";
    
            /**
             * Creates a new LoadEmailRequest instance using the specified properties.
             * @function create
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {email_client.ILoadEmailRequest=} [properties] Properties to set
             * @returns {email_client.LoadEmailRequest} LoadEmailRequest instance
             */
            LoadEmailRequest.create = function create(properties) {
                return new LoadEmailRequest(properties);
            };
    
            /**
             * Encodes the specified LoadEmailRequest message. Does not implicitly {@link email_client.LoadEmailRequest.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {email_client.ILoadEmailRequest} message LoadEmailRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadEmailRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                return writer;
            };
    
            /**
             * Encodes the specified LoadEmailRequest message, length delimited. Does not implicitly {@link email_client.LoadEmailRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {email_client.ILoadEmailRequest} message LoadEmailRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadEmailRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadEmailRequest message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadEmailRequest} LoadEmailRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadEmailRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadEmailRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadEmailRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadEmailRequest} LoadEmailRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadEmailRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadEmailRequest message.
             * @function verify
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadEmailRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                return null;
            };
    
            /**
             * Creates a LoadEmailRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadEmailRequest} LoadEmailRequest
             */
            LoadEmailRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadEmailRequest)
                    return object;
                var message = new $root.email_client.LoadEmailRequest();
                if (object.id != null)
                    message.id = String(object.id);
                return message;
            };
    
            /**
             * Creates a plain object from a LoadEmailRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadEmailRequest
             * @static
             * @param {email_client.LoadEmailRequest} message LoadEmailRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadEmailRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.id = "";
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };
    
            /**
             * Converts this LoadEmailRequest to JSON.
             * @function toJSON
             * @memberof email_client.LoadEmailRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadEmailRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadEmailRequest;
        })();
    
        email_client.LoadEmailResponse = (function() {
    
            /**
             * Properties of a LoadEmailResponse.
             * @memberof email_client
             * @interface ILoadEmailResponse
             * @property {string|null} [id] LoadEmailResponse id
             * @property {string|null} [inboxId] LoadEmailResponse inboxId
             * @property {string|null} [from] LoadEmailResponse from
             * @property {string|null} [to] LoadEmailResponse to
             * @property {string|null} [subject] LoadEmailResponse subject
             * @property {boolean|null} [read] LoadEmailResponse read
             * @property {number|null} [imapIndex] LoadEmailResponse imapIndex
             * @property {string|null} [textPlainBody] LoadEmailResponse textPlainBody
             * @property {string|null} [htmlBody] LoadEmailResponse htmlBody
             * @property {Object.<string,string>|null} [headers] LoadEmailResponse headers
             * @property {Array.<email_client.IAttachmentHeader>|null} [attachments] LoadEmailResponse attachments
             */
    
            /**
             * Constructs a new LoadEmailResponse.
             * @memberof email_client
             * @classdesc Represents a LoadEmailResponse.
             * @implements ILoadEmailResponse
             * @constructor
             * @param {email_client.ILoadEmailResponse=} [properties] Properties to set
             */
            function LoadEmailResponse(properties) {
                this.headers = {};
                this.attachments = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * LoadEmailResponse id.
             * @member {string} id
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.id = "";
    
            /**
             * LoadEmailResponse inboxId.
             * @member {string} inboxId
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.inboxId = "";
    
            /**
             * LoadEmailResponse from.
             * @member {string} from
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.from = "";
    
            /**
             * LoadEmailResponse to.
             * @member {string} to
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.to = "";
    
            /**
             * LoadEmailResponse subject.
             * @member {string} subject
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.subject = "";
    
            /**
             * LoadEmailResponse read.
             * @member {boolean} read
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.read = false;
    
            /**
             * LoadEmailResponse imapIndex.
             * @member {number} imapIndex
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.imapIndex = 0;
    
            /**
             * LoadEmailResponse textPlainBody.
             * @member {string} textPlainBody
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.textPlainBody = "";
    
            /**
             * LoadEmailResponse htmlBody.
             * @member {string} htmlBody
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.htmlBody = "";
    
            /**
             * LoadEmailResponse headers.
             * @member {Object.<string,string>} headers
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.headers = $util.emptyObject;
    
            /**
             * LoadEmailResponse attachments.
             * @member {Array.<email_client.IAttachmentHeader>} attachments
             * @memberof email_client.LoadEmailResponse
             * @instance
             */
            LoadEmailResponse.prototype.attachments = $util.emptyArray;
    
            /**
             * Creates a new LoadEmailResponse instance using the specified properties.
             * @function create
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {email_client.ILoadEmailResponse=} [properties] Properties to set
             * @returns {email_client.LoadEmailResponse} LoadEmailResponse instance
             */
            LoadEmailResponse.create = function create(properties) {
                return new LoadEmailResponse(properties);
            };
    
            /**
             * Encodes the specified LoadEmailResponse message. Does not implicitly {@link email_client.LoadEmailResponse.verify|verify} messages.
             * @function encode
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {email_client.ILoadEmailResponse} message LoadEmailResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadEmailResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && message.hasOwnProperty("id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.inboxId);
                if (message.from != null && message.hasOwnProperty("from"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.from);
                if (message.to != null && message.hasOwnProperty("to"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.to);
                if (message.subject != null && message.hasOwnProperty("subject"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.subject);
                if (message.read != null && message.hasOwnProperty("read"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.read);
                if (message.imapIndex != null && message.hasOwnProperty("imapIndex"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.imapIndex);
                if (message.textPlainBody != null && message.hasOwnProperty("textPlainBody"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.textPlainBody);
                if (message.htmlBody != null && message.hasOwnProperty("htmlBody"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.htmlBody);
                if (message.headers != null && message.hasOwnProperty("headers"))
                    for (var keys = Object.keys(message.headers), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 10, wireType 2 =*/82).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.headers[keys[i]]).ldelim();
                if (message.attachments != null && message.attachments.length)
                    for (var i = 0; i < message.attachments.length; ++i)
                        $root.email_client.AttachmentHeader.encode(message.attachments[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified LoadEmailResponse message, length delimited. Does not implicitly {@link email_client.LoadEmailResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {email_client.ILoadEmailResponse} message LoadEmailResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LoadEmailResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a LoadEmailResponse message from the specified reader or buffer.
             * @function decode
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {email_client.LoadEmailResponse} LoadEmailResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadEmailResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.email_client.LoadEmailResponse(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.string();
                        break;
                    case 2:
                        message.inboxId = reader.string();
                        break;
                    case 3:
                        message.from = reader.string();
                        break;
                    case 4:
                        message.to = reader.string();
                        break;
                    case 5:
                        message.subject = reader.string();
                        break;
                    case 6:
                        message.read = reader.bool();
                        break;
                    case 7:
                        message.imapIndex = reader.int32();
                        break;
                    case 8:
                        message.textPlainBody = reader.string();
                        break;
                    case 9:
                        message.htmlBody = reader.string();
                        break;
                    case 10:
                        reader.skip().pos++;
                        if (message.headers === $util.emptyObject)
                            message.headers = {};
                        key = reader.string();
                        reader.pos++;
                        message.headers[key] = reader.string();
                        break;
                    case 11:
                        if (!(message.attachments && message.attachments.length))
                            message.attachments = [];
                        message.attachments.push($root.email_client.AttachmentHeader.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a LoadEmailResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {email_client.LoadEmailResponse} LoadEmailResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LoadEmailResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a LoadEmailResponse message.
             * @function verify
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LoadEmailResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    if (!$util.isString(message.inboxId))
                        return "inboxId: string expected";
                if (message.from != null && message.hasOwnProperty("from"))
                    if (!$util.isString(message.from))
                        return "from: string expected";
                if (message.to != null && message.hasOwnProperty("to"))
                    if (!$util.isString(message.to))
                        return "to: string expected";
                if (message.subject != null && message.hasOwnProperty("subject"))
                    if (!$util.isString(message.subject))
                        return "subject: string expected";
                if (message.read != null && message.hasOwnProperty("read"))
                    if (typeof message.read !== "boolean")
                        return "read: boolean expected";
                if (message.imapIndex != null && message.hasOwnProperty("imapIndex"))
                    if (!$util.isInteger(message.imapIndex))
                        return "imapIndex: integer expected";
                if (message.textPlainBody != null && message.hasOwnProperty("textPlainBody"))
                    if (!$util.isString(message.textPlainBody))
                        return "textPlainBody: string expected";
                if (message.htmlBody != null && message.hasOwnProperty("htmlBody"))
                    if (!$util.isString(message.htmlBody))
                        return "htmlBody: string expected";
                if (message.headers != null && message.hasOwnProperty("headers")) {
                    if (!$util.isObject(message.headers))
                        return "headers: object expected";
                    var key = Object.keys(message.headers);
                    for (var i = 0; i < key.length; ++i)
                        if (!$util.isString(message.headers[key[i]]))
                            return "headers: string{k:string} expected";
                }
                if (message.attachments != null && message.hasOwnProperty("attachments")) {
                    if (!Array.isArray(message.attachments))
                        return "attachments: array expected";
                    for (var i = 0; i < message.attachments.length; ++i) {
                        var error = $root.email_client.AttachmentHeader.verify(message.attachments[i]);
                        if (error)
                            return "attachments." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a LoadEmailResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {email_client.LoadEmailResponse} LoadEmailResponse
             */
            LoadEmailResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.email_client.LoadEmailResponse)
                    return object;
                var message = new $root.email_client.LoadEmailResponse();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.inboxId != null)
                    message.inboxId = String(object.inboxId);
                if (object.from != null)
                    message.from = String(object.from);
                if (object.to != null)
                    message.to = String(object.to);
                if (object.subject != null)
                    message.subject = String(object.subject);
                if (object.read != null)
                    message.read = Boolean(object.read);
                if (object.imapIndex != null)
                    message.imapIndex = object.imapIndex | 0;
                if (object.textPlainBody != null)
                    message.textPlainBody = String(object.textPlainBody);
                if (object.htmlBody != null)
                    message.htmlBody = String(object.htmlBody);
                if (object.headers) {
                    if (typeof object.headers !== "object")
                        throw TypeError(".email_client.LoadEmailResponse.headers: object expected");
                    message.headers = {};
                    for (var keys = Object.keys(object.headers), i = 0; i < keys.length; ++i)
                        message.headers[keys[i]] = String(object.headers[keys[i]]);
                }
                if (object.attachments) {
                    if (!Array.isArray(object.attachments))
                        throw TypeError(".email_client.LoadEmailResponse.attachments: array expected");
                    message.attachments = [];
                    for (var i = 0; i < object.attachments.length; ++i) {
                        if (typeof object.attachments[i] !== "object")
                            throw TypeError(".email_client.LoadEmailResponse.attachments: object expected");
                        message.attachments[i] = $root.email_client.AttachmentHeader.fromObject(object.attachments[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a LoadEmailResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof email_client.LoadEmailResponse
             * @static
             * @param {email_client.LoadEmailResponse} message LoadEmailResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LoadEmailResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.attachments = [];
                if (options.objects || options.defaults)
                    object.headers = {};
                if (options.defaults) {
                    object.id = "";
                    object.inboxId = "";
                    object.from = "";
                    object.to = "";
                    object.subject = "";
                    object.read = false;
                    object.imapIndex = 0;
                    object.textPlainBody = "";
                    object.htmlBody = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.inboxId != null && message.hasOwnProperty("inboxId"))
                    object.inboxId = message.inboxId;
                if (message.from != null && message.hasOwnProperty("from"))
                    object.from = message.from;
                if (message.to != null && message.hasOwnProperty("to"))
                    object.to = message.to;
                if (message.subject != null && message.hasOwnProperty("subject"))
                    object.subject = message.subject;
                if (message.read != null && message.hasOwnProperty("read"))
                    object.read = message.read;
                if (message.imapIndex != null && message.hasOwnProperty("imapIndex"))
                    object.imapIndex = message.imapIndex;
                if (message.textPlainBody != null && message.hasOwnProperty("textPlainBody"))
                    object.textPlainBody = message.textPlainBody;
                if (message.htmlBody != null && message.hasOwnProperty("htmlBody"))
                    object.htmlBody = message.htmlBody;
                var keys2;
                if (message.headers && (keys2 = Object.keys(message.headers)).length) {
                    object.headers = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.headers[keys2[j]] = message.headers[keys2[j]];
                }
                if (message.attachments && message.attachments.length) {
                    object.attachments = [];
                    for (var j = 0; j < message.attachments.length; ++j)
                        object.attachments[j] = $root.email_client.AttachmentHeader.toObject(message.attachments[j], options);
                }
                return object;
            };
    
            /**
             * Converts this LoadEmailResponse to JSON.
             * @function toJSON
             * @memberof email_client.LoadEmailResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LoadEmailResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return LoadEmailResponse;
        })();
    
        return email_client;
    })();

    return $root;
});


/***/ }),

/***/ "./src/websocket.ts":
/*!**************************!*\
  !*** ./src/websocket.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_compiled_1 = __webpack_require__(/*! ./protobuf_compiled */ "./src/protobuf_compiled.js");
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
            this.socket.send(protobuf_compiled_1.email_client.ClientToServer.encode({
                authenticate: {
                    username,
                    password,
                }
            }).finish());
        }
    }
    load_inbox(inbox) {
        if (this.socket) {
            this.socket.send(protobuf_compiled_1.email_client.ClientToServer.encode({
                loadInbox: {
                    id: inbox.id
                }
            }).finish());
        }
        this.current_inbox = inbox;
    }
    load_email(email) {
        if (this.socket) {
            this.socket.send(protobuf_compiled_1.email_client.ClientToServer.encode({
                loadEmail: {
                    id: email.id
                }
            }).finish());
        }
    }
    load_attachment(attachment) {
        if (this.socket) {
            this.socket.send(protobuf_compiled_1.email_client.ClientToServer.encode({
                loadAttachment: {
                    id: attachment.id
                }
            }).finish());
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
        this.ping_timer = setInterval(() => {
            if (this.socket)
                this.socket.send(""); // ping
        }, 1000);
    }
    onclose(ev) {
        this.socket = null;
        if (this.ping_timer) {
            clearTimeout(this.ping_timer);
        }
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
        const data = ev.data;
        if (data instanceof Blob) {
            const reader = new FileReader();
            const self = this;
            reader.onload = function () {
                let buffer;
                if (reader.result instanceof ArrayBuffer) {
                    buffer = new Uint8Array(reader.result);
                }
                else if (typeof reader.result == "string") {
                    let enc = new TextEncoder();
                    buffer = enc.encode(reader.result);
                }
                else {
                    // reader.result == null
                    return;
                }
                console.log(buffer);
                let message = protobuf_compiled_1.email_client.ServerToClient.decode(buffer);
                if (message.authenticate != null) {
                    self.handler.authenticate_result(message.authenticate.success || false);
                    if (message.authenticate.success === true && message.authenticate.inboxes) {
                        self.handler.setup(message.authenticate.inboxes);
                    }
                    else {
                        self.handler.setup([]);
                    }
                }
                else if (message.attachment != null) {
                    self.handler.attachment_loaded(message.attachment);
                }
                else if (message.inbox != null) {
                    console.log(message.inbox);
                    self.handler.inbox_loaded(message.inbox);
                }
                else {
                    console.log("Unknown message", message);
                }
            };
            reader.readAsText(data);
        }
        /*
        console.log(ev.data);
        var bytes = Array.prototype.slice.call(ev.data, 0, ev.data.size);
        console.log(bytes);
        let data = ev.data as Uint8Array;
        if (data != null) {
            let message = email_client.ServerToClient.decode(data);
            console.log(message);
        }
        /*return;
        let json: server.WebSocketMessage = JSON.parse(ev.data);
        if (json.init) {
            this.handler.setup(json.init);
            if (this.current_inbox) {
                this.load_inbox(this.current_inbox);
            }
        } else if (json.email_received) {
            this.handler.email_received(json.email_received);
        } else if (json.inbox_loaded) {
            this.handler.inbox_loaded(
                json.inbox_loaded.inbox_with_address,
                json.inbox_loaded.emails
            );
        } else if (json.email_loaded) {
            this.handler.email_loaded(
                json.email_loaded
            );
        } else if (json.attachment_loaded) {
            this.handler.attachment_loaded(
                json.attachment_loaded
            );
        } else if (json.authenticate_result === true || json.authenticate_result === false) {
            this.handler.authenticate_result(json.authenticate_result);
        } else {
            console.log("Unknown server message", json);
        }*/
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