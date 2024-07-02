import { env } from "@/env.server";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: "us-east-1",
    endpoint: env.R2_ENDPOINT,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});
