import { z } from "zod";

const schema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: z.number().default(3000),
    HOSTNAME: z.string().default("localhost"),
});

export const env = schema.parse(process.env);
