namespace server {
    export interface Address {
        short_name: string;
        email_address: string;
        unseen_count: number;
    }

    export interface Email {
        from: string | null;
        to: string | null;
        subject: string | null;
        body: string[];
        seen: boolean;
    }
}