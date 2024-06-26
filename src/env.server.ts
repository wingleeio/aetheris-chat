"server-only";

import { z } from "zod";

const schema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.number().default(3000),
    HOSTNAME: z.string().default("localhost"),
    AUTH_HEADER: z.string().default("x-session-data"),
    AUTH_COOKIE: z.string().default("aetheris-chat-session"),
    RESEND_API_KEY: z.string(),
});

export const env = schema.parse(process.env);
