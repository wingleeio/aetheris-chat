import { z } from "zod";

const schema = z.object({
    NODE_ENV: z.string().default("development"),
    NEXT_PUBLIC_URL: z.string().default("http://localhost:3000/aether"),
    NEXT_PUBLIC_WS_URL: z.string().default("ws://localhost:3001"),
    NEXT_PUBLIC_FILES_URL: z.string(),
});

export const env = schema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_FILES_URL: process.env.NEXT_PUBLIC_FILES_URL,
});
