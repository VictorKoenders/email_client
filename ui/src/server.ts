namespace server {
    export interface WebSocketMessage {
        email_received?: EmailInfo;
        email_loaded?: Email;
        attachment_loaded?: Attachment;
        inbox_loaded?: InboxLoaded;
        init?: Inbox[];
        authenticate_result?: boolean;
    }

    export interface Attachment {
        id: string;
        headers: {[key: string]: string};
        mime_type: string;
        name: string | null;
        content_id: string | null;
        contents: number[];
    }

    export interface EmailInfo {
        id: string;
        inbox_id: string;
        from: string | null;
        to: string | null;
        subject: string | null;
        read: boolean;
    }
    
    export interface Email extends EmailInfo {
        imap_index: number;
        text_plain_body: string | null;
        html_body: string | null;

        headers: EmailHeaders;
        attachments: AttachmentInfo[];
    }

    export type EmailHeaders = {[key: string]: string};

    export interface AttachmentInfo {
        id: string;
        mime_type: string;
        name: string | null;
        content_id: string | null;
    }

    export interface InboxLoaded {
        inbox_with_address: Inbox;
        emails: EmailInfo[];
    }

    export interface Inbox {
        id: string;
        name: string;
        addresses: string[];
        unread_count: number;
    }

}