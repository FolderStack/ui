import { DefaultSession, ISODateString } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: {
            id: string;
            orgId: string;
            role: string;
            email: string;
            name: string;
            image: string;
        }
    }
}