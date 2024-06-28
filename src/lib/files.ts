import { env } from "@/env.server";
import { s3 } from "@/services/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { v4 } from "uuid";

export const files = {
    upload: async (prefix: string, file: string) => {
        const key = `${prefix}-${v4()}`;
        const base64Data = file.split(",")[1] || file;
        const decoded = Buffer.from(base64Data, "base64");
        const fileTypeResult = await fileTypeFromBuffer(decoded);
        const contentType = fileTypeResult?.mime ?? "application/octet-stream";
        const upload = new PutObjectCommand({
            Bucket: "aetheris",
            Key: key,
            Body: decoded,
            ContentType: contentType,
        });
        await s3.send(upload);
        return `${env.NEXT_PUBLIC_FILES_URL}/${key}`;
    },
};
