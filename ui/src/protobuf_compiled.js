/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

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
         * @property {email_client.IAuthenticateRequest|null} [authenticate] ServerToClient authenticate
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
         * @member {email_client.IAuthenticateRequest|null|undefined} authenticate
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
                $root.email_client.AuthenticateRequest.encode(message.authenticate, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                    message.authenticate = $root.email_client.AuthenticateRequest.decode(reader, reader.uint32());
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
                    var error = $root.email_client.AuthenticateRequest.verify(message.authenticate);
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
                message.authenticate = $root.email_client.AuthenticateRequest.fromObject(object.authenticate);
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
                object.authenticate = $root.email_client.AuthenticateRequest.toObject(message.authenticate, options);
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
            if (options.defaults)
                object.success = false;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
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

    return email_client;
})();

module.exports = $root;
