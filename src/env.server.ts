"server-only";

import { env as clientEnv } from "@/env.client";
import { z } from "zod";

const schema = z.object({
    PORT: z.string().default("3000"),
    HOSTNAME: z.string().default("localhost"),
    AUTH_HEADER: z.string().default("x-session-data"),
    AUTH_COOKIE: z.string().default("aetheris-chat-session"),
    RESEND_API_KEY: z.string(),
    R2_TOKEN: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_ENDPOINT: z.string(),
    EMAIL: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    OAUTH_CALLBACK_URL: z.string(),
});

export const env = {
    ...schema.parse(process.env),
    ...clientEnv,
};
