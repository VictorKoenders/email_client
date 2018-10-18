import * as $protobuf from "protobufjs";
/** Namespace email_client. */
export namespace email_client {

    /** Properties of a ClientToServer. */
    interface IClientToServer {

        /** ClientToServer loadInbox */
        loadInbox?: (email_client.ILoadInboxRequest|null);

        /** ClientToServer authenticate */
        authenticate?: (email_client.IAuthenticateRequest|null);

        /** ClientToServer loadEmail */
        loadEmail?: (email_client.ILoadEmailRequest|null);

        /** ClientToServer loadAttachment */
        loadAttachment?: (email_client.ILoadAttachmentRequest|null);
    }

    /** Represents a ClientToServer. */
    class ClientToServer implements IClientToServer {

        /**
         * Constructs a new ClientToServer.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IClientToServer);

        /** ClientToServer loadInbox. */
        public loadInbox?: (email_client.ILoadInboxRequest|null);

        /** ClientToServer authenticate. */
        public authenticate?: (email_client.IAuthenticateRequest|null);

        /** ClientToServer loadEmail. */
        public loadEmail?: (email_client.ILoadEmailRequest|null);

        /** ClientToServer loadAttachment. */
        public loadAttachment?: (email_client.ILoadAttachmentRequest|null);

        /** ClientToServer message. */
        public message?: ("loadInbox"|"authenticate"|"loadEmail"|"loadAttachment");

        /**
         * Creates a new ClientToServer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientToServer instance
         */
        public static create(properties?: email_client.IClientToServer): email_client.ClientToServer;

        /**
         * Encodes the specified ClientToServer message. Does not implicitly {@link email_client.ClientToServer.verify|verify} messages.
         * @param message ClientToServer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IClientToServer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientToServer message, length delimited. Does not implicitly {@link email_client.ClientToServer.verify|verify} messages.
         * @param message ClientToServer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IClientToServer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientToServer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientToServer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.ClientToServer;

        /**
         * Decodes a ClientToServer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientToServer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.ClientToServer;

        /**
         * Verifies a ClientToServer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientToServer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientToServer
         */
        public static fromObject(object: { [k: string]: any }): email_client.ClientToServer;

        /**
         * Creates a plain object from a ClientToServer message. Also converts values to other types if specified.
         * @param message ClientToServer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.ClientToServer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientToServer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ServerToClient. */
    interface IServerToClient {

        /** ServerToClient error */
        error?: (email_client.IError|null);

        /** ServerToClient authenticate */
        authenticate?: (email_client.IAuthenticateResponse|null);

        /** ServerToClient inbox */
        inbox?: (email_client.ILoadInboxResponse|null);

        /** ServerToClient email */
        email?: (email_client.ILoadEmailResponse|null);

        /** ServerToClient attachment */
        attachment?: (email_client.ILoadAttachmentResponse|null);
    }

    /** Represents a ServerToClient. */
    class ServerToClient implements IServerToClient {

        /**
         * Constructs a new ServerToClient.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IServerToClient);

        /** ServerToClient error. */
        public error?: (email_client.IError|null);

        /** ServerToClient authenticate. */
        public authenticate?: (email_client.IAuthenticateResponse|null);

        /** ServerToClient inbox. */
        public inbox?: (email_client.ILoadInboxResponse|null);

        /** ServerToClient email. */
        public email?: (email_client.ILoadEmailResponse|null);

        /** ServerToClient attachment. */
        public attachment?: (email_client.ILoadAttachmentResponse|null);

        /** ServerToClient message. */
        public message?: ("error"|"authenticate"|"inbox"|"email"|"attachment");

        /**
         * Creates a new ServerToClient instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerToClient instance
         */
        public static create(properties?: email_client.IServerToClient): email_client.ServerToClient;

        /**
         * Encodes the specified ServerToClient message. Does not implicitly {@link email_client.ServerToClient.verify|verify} messages.
         * @param message ServerToClient message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IServerToClient, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerToClient message, length delimited. Does not implicitly {@link email_client.ServerToClient.verify|verify} messages.
         * @param message ServerToClient message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IServerToClient, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerToClient message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerToClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.ServerToClient;

        /**
         * Decodes a ServerToClient message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerToClient
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.ServerToClient;

        /**
         * Verifies a ServerToClient message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerToClient message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerToClient
         */
        public static fromObject(object: { [k: string]: any }): email_client.ServerToClient;

        /**
         * Creates a plain object from a ServerToClient message. Also converts values to other types if specified.
         * @param message ServerToClient
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.ServerToClient, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerToClient to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Error. */
    interface IError {

        /** Error error */
        error?: (string|null);
    }

    /** Represents an Error. */
    class Error implements IError {

        /**
         * Constructs a new Error.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IError);

        /** Error error. */
        public error: string;

        /**
         * Creates a new Error instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Error instance
         */
        public static create(properties?: email_client.IError): email_client.Error;

        /**
         * Encodes the specified Error message. Does not implicitly {@link email_client.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link email_client.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.Error;

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.Error;

        /**
         * Verifies an Error message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Error
         */
        public static fromObject(object: { [k: string]: any }): email_client.Error;

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @param message Error
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Error to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AttachmentHeader. */
    interface IAttachmentHeader {

        /** AttachmentHeader id */
        id?: (string|null);

        /** AttachmentHeader mimeType */
        mimeType?: (string|null);

        /** AttachmentHeader name */
        name?: (string|null);

        /** AttachmentHeader contentId */
        contentId?: (string|null);
    }

    /** Represents an AttachmentHeader. */
    class AttachmentHeader implements IAttachmentHeader {

        /**
         * Constructs a new AttachmentHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IAttachmentHeader);

        /** AttachmentHeader id. */
        public id: string;

        /** AttachmentHeader mimeType. */
        public mimeType: string;

        /** AttachmentHeader name. */
        public name: string;

        /** AttachmentHeader contentId. */
        public contentId: string;

        /**
         * Creates a new AttachmentHeader instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AttachmentHeader instance
         */
        public static create(properties?: email_client.IAttachmentHeader): email_client.AttachmentHeader;

        /**
         * Encodes the specified AttachmentHeader message. Does not implicitly {@link email_client.AttachmentHeader.verify|verify} messages.
         * @param message AttachmentHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IAttachmentHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AttachmentHeader message, length delimited. Does not implicitly {@link email_client.AttachmentHeader.verify|verify} messages.
         * @param message AttachmentHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IAttachmentHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AttachmentHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AttachmentHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.AttachmentHeader;

        /**
         * Decodes an AttachmentHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AttachmentHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.AttachmentHeader;

        /**
         * Verifies an AttachmentHeader message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AttachmentHeader message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AttachmentHeader
         */
        public static fromObject(object: { [k: string]: any }): email_client.AttachmentHeader;

        /**
         * Creates a plain object from an AttachmentHeader message. Also converts values to other types if specified.
         * @param message AttachmentHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.AttachmentHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AttachmentHeader to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadAttachmentRequest. */
    interface ILoadAttachmentRequest {

        /** LoadAttachmentRequest id */
        id?: (string|null);
    }

    /** Represents a LoadAttachmentRequest. */
    class LoadAttachmentRequest implements ILoadAttachmentRequest {

        /**
         * Constructs a new LoadAttachmentRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadAttachmentRequest);

        /** LoadAttachmentRequest id. */
        public id: string;

        /**
         * Creates a new LoadAttachmentRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadAttachmentRequest instance
         */
        public static create(properties?: email_client.ILoadAttachmentRequest): email_client.LoadAttachmentRequest;

        /**
         * Encodes the specified LoadAttachmentRequest message. Does not implicitly {@link email_client.LoadAttachmentRequest.verify|verify} messages.
         * @param message LoadAttachmentRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadAttachmentRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadAttachmentRequest message, length delimited. Does not implicitly {@link email_client.LoadAttachmentRequest.verify|verify} messages.
         * @param message LoadAttachmentRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadAttachmentRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadAttachmentRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadAttachmentRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadAttachmentRequest;

        /**
         * Decodes a LoadAttachmentRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadAttachmentRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadAttachmentRequest;

        /**
         * Verifies a LoadAttachmentRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadAttachmentRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadAttachmentRequest
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadAttachmentRequest;

        /**
         * Creates a plain object from a LoadAttachmentRequest message. Also converts values to other types if specified.
         * @param message LoadAttachmentRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadAttachmentRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadAttachmentRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadAttachmentResponse. */
    interface ILoadAttachmentResponse {

        /** LoadAttachmentResponse id */
        id?: (string|null);

        /** LoadAttachmentResponse headers */
        headers?: ({ [k: string]: string }|null);

        /** LoadAttachmentResponse mimeType */
        mimeType?: (string|null);

        /** LoadAttachmentResponse name */
        name?: (string|null);

        /** LoadAttachmentResponse contentId */
        contentId?: (string|null);

        /** LoadAttachmentResponse contents */
        contents?: (Uint8Array|null);
    }

    /** Represents a LoadAttachmentResponse. */
    class LoadAttachmentResponse implements ILoadAttachmentResponse {

        /**
         * Constructs a new LoadAttachmentResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadAttachmentResponse);

        /** LoadAttachmentResponse id. */
        public id: string;

        /** LoadAttachmentResponse headers. */
        public headers: { [k: string]: string };

        /** LoadAttachmentResponse mimeType. */
        public mimeType: string;

        /** LoadAttachmentResponse name. */
        public name: string;

        /** LoadAttachmentResponse contentId. */
        public contentId: string;

        /** LoadAttachmentResponse contents. */
        public contents: Uint8Array;

        /**
         * Creates a new LoadAttachmentResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadAttachmentResponse instance
         */
        public static create(properties?: email_client.ILoadAttachmentResponse): email_client.LoadAttachmentResponse;

        /**
         * Encodes the specified LoadAttachmentResponse message. Does not implicitly {@link email_client.LoadAttachmentResponse.verify|verify} messages.
         * @param message LoadAttachmentResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadAttachmentResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadAttachmentResponse message, length delimited. Does not implicitly {@link email_client.LoadAttachmentResponse.verify|verify} messages.
         * @param message LoadAttachmentResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadAttachmentResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadAttachmentResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadAttachmentResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadAttachmentResponse;

        /**
         * Decodes a LoadAttachmentResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadAttachmentResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadAttachmentResponse;

        /**
         * Verifies a LoadAttachmentResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadAttachmentResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadAttachmentResponse
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadAttachmentResponse;

        /**
         * Creates a plain object from a LoadAttachmentResponse message. Also converts values to other types if specified.
         * @param message LoadAttachmentResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadAttachmentResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadAttachmentResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AuthenticateRequest. */
    interface IAuthenticateRequest {

        /** AuthenticateRequest username */
        username?: (string|null);

        /** AuthenticateRequest password */
        password?: (string|null);
    }

    /** Represents an AuthenticateRequest. */
    class AuthenticateRequest implements IAuthenticateRequest {

        /**
         * Constructs a new AuthenticateRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IAuthenticateRequest);

        /** AuthenticateRequest username. */
        public username: string;

        /** AuthenticateRequest password. */
        public password: string;

        /**
         * Creates a new AuthenticateRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthenticateRequest instance
         */
        public static create(properties?: email_client.IAuthenticateRequest): email_client.AuthenticateRequest;

        /**
         * Encodes the specified AuthenticateRequest message. Does not implicitly {@link email_client.AuthenticateRequest.verify|verify} messages.
         * @param message AuthenticateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthenticateRequest message, length delimited. Does not implicitly {@link email_client.AuthenticateRequest.verify|verify} messages.
         * @param message AuthenticateRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IAuthenticateRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthenticateRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthenticateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.AuthenticateRequest;

        /**
         * Decodes an AuthenticateRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthenticateRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.AuthenticateRequest;

        /**
         * Verifies an AuthenticateRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthenticateRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthenticateRequest
         */
        public static fromObject(object: { [k: string]: any }): email_client.AuthenticateRequest;

        /**
         * Creates a plain object from an AuthenticateRequest message. Also converts values to other types if specified.
         * @param message AuthenticateRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.AuthenticateRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthenticateRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AuthenticateResponse. */
    interface IAuthenticateResponse {

        /** AuthenticateResponse success */
        success?: (boolean|null);

        /** AuthenticateResponse inboxes */
        inboxes?: (email_client.IInboxHeader[]|null);
    }

    /** Represents an AuthenticateResponse. */
    class AuthenticateResponse implements IAuthenticateResponse {

        /**
         * Constructs a new AuthenticateResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IAuthenticateResponse);

        /** AuthenticateResponse success. */
        public success: boolean;

        /** AuthenticateResponse inboxes. */
        public inboxes: email_client.IInboxHeader[];

        /**
         * Creates a new AuthenticateResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthenticateResponse instance
         */
        public static create(properties?: email_client.IAuthenticateResponse): email_client.AuthenticateResponse;

        /**
         * Encodes the specified AuthenticateResponse message. Does not implicitly {@link email_client.AuthenticateResponse.verify|verify} messages.
         * @param message AuthenticateResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IAuthenticateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthenticateResponse message, length delimited. Does not implicitly {@link email_client.AuthenticateResponse.verify|verify} messages.
         * @param message AuthenticateResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IAuthenticateResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthenticateResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthenticateResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.AuthenticateResponse;

        /**
         * Decodes an AuthenticateResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthenticateResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.AuthenticateResponse;

        /**
         * Verifies an AuthenticateResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthenticateResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthenticateResponse
         */
        public static fromObject(object: { [k: string]: any }): email_client.AuthenticateResponse;

        /**
         * Creates a plain object from an AuthenticateResponse message. Also converts values to other types if specified.
         * @param message AuthenticateResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.AuthenticateResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthenticateResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InboxHeader. */
    interface IInboxHeader {

        /** InboxHeader id */
        id?: (string|null);

        /** InboxHeader name */
        name?: (string|null);

        /** InboxHeader unreadCount */
        unreadCount?: (number|null);
    }

    /** Represents an InboxHeader. */
    class InboxHeader implements IInboxHeader {

        /**
         * Constructs a new InboxHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IInboxHeader);

        /** InboxHeader id. */
        public id: string;

        /** InboxHeader name. */
        public name: string;

        /** InboxHeader unreadCount. */
        public unreadCount: number;

        /**
         * Creates a new InboxHeader instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InboxHeader instance
         */
        public static create(properties?: email_client.IInboxHeader): email_client.InboxHeader;

        /**
         * Encodes the specified InboxHeader message. Does not implicitly {@link email_client.InboxHeader.verify|verify} messages.
         * @param message InboxHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IInboxHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InboxHeader message, length delimited. Does not implicitly {@link email_client.InboxHeader.verify|verify} messages.
         * @param message InboxHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IInboxHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InboxHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InboxHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.InboxHeader;

        /**
         * Decodes an InboxHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InboxHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.InboxHeader;

        /**
         * Verifies an InboxHeader message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InboxHeader message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InboxHeader
         */
        public static fromObject(object: { [k: string]: any }): email_client.InboxHeader;

        /**
         * Creates a plain object from an InboxHeader message. Also converts values to other types if specified.
         * @param message InboxHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.InboxHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InboxHeader to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadInboxRequest. */
    interface ILoadInboxRequest {

        /** LoadInboxRequest id */
        id?: (string|null);
    }

    /** Represents a LoadInboxRequest. */
    class LoadInboxRequest implements ILoadInboxRequest {

        /**
         * Constructs a new LoadInboxRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadInboxRequest);

        /** LoadInboxRequest id. */
        public id: string;

        /**
         * Creates a new LoadInboxRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadInboxRequest instance
         */
        public static create(properties?: email_client.ILoadInboxRequest): email_client.LoadInboxRequest;

        /**
         * Encodes the specified LoadInboxRequest message. Does not implicitly {@link email_client.LoadInboxRequest.verify|verify} messages.
         * @param message LoadInboxRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadInboxRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadInboxRequest message, length delimited. Does not implicitly {@link email_client.LoadInboxRequest.verify|verify} messages.
         * @param message LoadInboxRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadInboxRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadInboxRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadInboxRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadInboxRequest;

        /**
         * Decodes a LoadInboxRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadInboxRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadInboxRequest;

        /**
         * Verifies a LoadInboxRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadInboxRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadInboxRequest
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadInboxRequest;

        /**
         * Creates a plain object from a LoadInboxRequest message. Also converts values to other types if specified.
         * @param message LoadInboxRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadInboxRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadInboxRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadInboxResponse. */
    interface ILoadInboxResponse {

        /** LoadInboxResponse id */
        id?: (string|null);

        /** LoadInboxResponse name */
        name?: (string|null);

        /** LoadInboxResponse addresses */
        addresses?: (string[]|null);

        /** LoadInboxResponse unreadCount */
        unreadCount?: (number|null);

        /** LoadInboxResponse emails */
        emails?: (email_client.IEmailHeader[]|null);
    }

    /** Represents a LoadInboxResponse. */
    class LoadInboxResponse implements ILoadInboxResponse {

        /**
         * Constructs a new LoadInboxResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadInboxResponse);

        /** LoadInboxResponse id. */
        public id: string;

        /** LoadInboxResponse name. */
        public name: string;

        /** LoadInboxResponse addresses. */
        public addresses: string[];

        /** LoadInboxResponse unreadCount. */
        public unreadCount: number;

        /** LoadInboxResponse emails. */
        public emails: email_client.IEmailHeader[];

        /**
         * Creates a new LoadInboxResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadInboxResponse instance
         */
        public static create(properties?: email_client.ILoadInboxResponse): email_client.LoadInboxResponse;

        /**
         * Encodes the specified LoadInboxResponse message. Does not implicitly {@link email_client.LoadInboxResponse.verify|verify} messages.
         * @param message LoadInboxResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadInboxResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadInboxResponse message, length delimited. Does not implicitly {@link email_client.LoadInboxResponse.verify|verify} messages.
         * @param message LoadInboxResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadInboxResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadInboxResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadInboxResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadInboxResponse;

        /**
         * Decodes a LoadInboxResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadInboxResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadInboxResponse;

        /**
         * Verifies a LoadInboxResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadInboxResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadInboxResponse
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadInboxResponse;

        /**
         * Creates a plain object from a LoadInboxResponse message. Also converts values to other types if specified.
         * @param message LoadInboxResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadInboxResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadInboxResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EmailHeader. */
    interface IEmailHeader {

        /** EmailHeader id */
        id?: (string|null);

        /** EmailHeader inboxId */
        inboxId?: (string|null);

        /** EmailHeader from */
        from?: (string|null);

        /** EmailHeader to */
        to?: (string|null);

        /** EmailHeader subject */
        subject?: (string|null);

        /** EmailHeader read */
        read?: (boolean|null);
    }

    /** Represents an EmailHeader. */
    class EmailHeader implements IEmailHeader {

        /**
         * Constructs a new EmailHeader.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.IEmailHeader);

        /** EmailHeader id. */
        public id: string;

        /** EmailHeader inboxId. */
        public inboxId: string;

        /** EmailHeader from. */
        public from: string;

        /** EmailHeader to. */
        public to: string;

        /** EmailHeader subject. */
        public subject: string;

        /** EmailHeader read. */
        public read: boolean;

        /**
         * Creates a new EmailHeader instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmailHeader instance
         */
        public static create(properties?: email_client.IEmailHeader): email_client.EmailHeader;

        /**
         * Encodes the specified EmailHeader message. Does not implicitly {@link email_client.EmailHeader.verify|verify} messages.
         * @param message EmailHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.IEmailHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmailHeader message, length delimited. Does not implicitly {@link email_client.EmailHeader.verify|verify} messages.
         * @param message EmailHeader message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.IEmailHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmailHeader message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmailHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.EmailHeader;

        /**
         * Decodes an EmailHeader message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmailHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.EmailHeader;

        /**
         * Verifies an EmailHeader message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmailHeader message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmailHeader
         */
        public static fromObject(object: { [k: string]: any }): email_client.EmailHeader;

        /**
         * Creates a plain object from an EmailHeader message. Also converts values to other types if specified.
         * @param message EmailHeader
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.EmailHeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmailHeader to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadEmailRequest. */
    interface ILoadEmailRequest {

        /** LoadEmailRequest id */
        id?: (string|null);
    }

    /** Represents a LoadEmailRequest. */
    class LoadEmailRequest implements ILoadEmailRequest {

        /**
         * Constructs a new LoadEmailRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadEmailRequest);

        /** LoadEmailRequest id. */
        public id: string;

        /**
         * Creates a new LoadEmailRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadEmailRequest instance
         */
        public static create(properties?: email_client.ILoadEmailRequest): email_client.LoadEmailRequest;

        /**
         * Encodes the specified LoadEmailRequest message. Does not implicitly {@link email_client.LoadEmailRequest.verify|verify} messages.
         * @param message LoadEmailRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadEmailRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadEmailRequest message, length delimited. Does not implicitly {@link email_client.LoadEmailRequest.verify|verify} messages.
         * @param message LoadEmailRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadEmailRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadEmailRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadEmailRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadEmailRequest;

        /**
         * Decodes a LoadEmailRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadEmailRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadEmailRequest;

        /**
         * Verifies a LoadEmailRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadEmailRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadEmailRequest
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadEmailRequest;

        /**
         * Creates a plain object from a LoadEmailRequest message. Also converts values to other types if specified.
         * @param message LoadEmailRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadEmailRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadEmailRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoadEmailResponse. */
    interface ILoadEmailResponse {

        /** LoadEmailResponse id */
        id?: (string|null);

        /** LoadEmailResponse inboxId */
        inboxId?: (string|null);

        /** LoadEmailResponse from */
        from?: (string|null);

        /** LoadEmailResponse to */
        to?: (string|null);

        /** LoadEmailResponse subject */
        subject?: (string|null);

        /** LoadEmailResponse read */
        read?: (boolean|null);

        /** LoadEmailResponse imapIndex */
        imapIndex?: (number|null);

        /** LoadEmailResponse textPlainBody */
        textPlainBody?: (string|null);

        /** LoadEmailResponse htmlBody */
        htmlBody?: (string|null);

        /** LoadEmailResponse headers */
        headers?: ({ [k: string]: string }|null);

        /** LoadEmailResponse attachments */
        attachments?: (email_client.IAttachmentHeader[]|null);
    }

    /** Represents a LoadEmailResponse. */
    class LoadEmailResponse implements ILoadEmailResponse {

        /**
         * Constructs a new LoadEmailResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: email_client.ILoadEmailResponse);

        /** LoadEmailResponse id. */
        public id: string;

        /** LoadEmailResponse inboxId. */
        public inboxId: string;

        /** LoadEmailResponse from. */
        public from: string;

        /** LoadEmailResponse to. */
        public to: string;

        /** LoadEmailResponse subject. */
        public subject: string;

        /** LoadEmailResponse read. */
        public read: boolean;

        /** LoadEmailResponse imapIndex. */
        public imapIndex: number;

        /** LoadEmailResponse textPlainBody. */
        public textPlainBody: string;

        /** LoadEmailResponse htmlBody. */
        public htmlBody: string;

        /** LoadEmailResponse headers. */
        public headers: { [k: string]: string };

        /** LoadEmailResponse attachments. */
        public attachments: email_client.IAttachmentHeader[];

        /**
         * Creates a new LoadEmailResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoadEmailResponse instance
         */
        public static create(properties?: email_client.ILoadEmailResponse): email_client.LoadEmailResponse;

        /**
         * Encodes the specified LoadEmailResponse message. Does not implicitly {@link email_client.LoadEmailResponse.verify|verify} messages.
         * @param message LoadEmailResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: email_client.ILoadEmailResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoadEmailResponse message, length delimited. Does not implicitly {@link email_client.LoadEmailResponse.verify|verify} messages.
         * @param message LoadEmailResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: email_client.ILoadEmailResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoadEmailResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoadEmailResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): email_client.LoadEmailResponse;

        /**
         * Decodes a LoadEmailResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoadEmailResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): email_client.LoadEmailResponse;

        /**
         * Verifies a LoadEmailResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoadEmailResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoadEmailResponse
         */
        public static fromObject(object: { [k: string]: any }): email_client.LoadEmailResponse;

        /**
         * Creates a plain object from a LoadEmailResponse message. Also converts values to other types if specified.
         * @param message LoadEmailResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: email_client.LoadEmailResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoadEmailResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
