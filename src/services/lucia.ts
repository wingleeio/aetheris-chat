import { EdgeDBAdapter } from "@/edgedb";
import { Lucia } from "lucia";
import { database } from "@/lib/database";
import { env } from "@/env.server";

const adapter = new EdgeDBAdapter(database);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: env.AUTH_COOKIE,
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return attributes;
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
    email_verified: boolean;
    profile: {
        avatar_url: string | null;
        cover_url: string | null;
        display_name: string;
        tag: string;
    } | null;
}
interface DatabaseSessionAttributes {}
