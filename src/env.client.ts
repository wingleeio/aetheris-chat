import { z } from "zod";

const schema = z.object({
    NEXT_PUBLIC_URL: z.string().default("http://localhost:3000/aether"),
    NEXT_PUBLIC_WS_URL: z.string().default("ws://localhost:3001"),
    NEXT_PUBLIC_FILES_URL: z.string(),
});

export const env = schema.parse({
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_FILES_URL: process.env.NEXT_PUBLIC_FILES_URL,
});
