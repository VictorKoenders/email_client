namespace server {
    export interface Address {
        id: string;
        short_name: string;
        email_address: string;
        unseen_count: number;
    }

    export interface Email {
        id: string;
        address_id: string;
        created_on: string;
        from: string | null;
        to: string | null;
        subject: string | null;
        body: string[];
        seen: boolean;
    }
}