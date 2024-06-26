import { z } from "zod";

const schema = z.object({
    NEXT_PUBLIC_URL: z.string().default("http://localhost:3000/aether"),
    NEXT_PUBLIC_WS_URL: z.string().default("ws://localhost:3000/aether"),
});

export const env = schema.parse(process.env);
