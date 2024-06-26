import { EdgeDBAdapter } from "@/edgedb";
import { env } from "@/env.server";
import { database } from "@/lib/database";
import { Lucia } from "lucia";

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
}
interface DatabaseSessionAttributes {}
