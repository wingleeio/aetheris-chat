import { env } from "@/env.server";
import { logger } from "@/lib/logger";
import { createHTTPHandler } from "@aetheris/server/adapters/http";
import { createServer } from "http";
import next from "next";
import app from "next/app";
import { createContext } from "react";

const nextApp = next({
    dev: env.NODE_ENV !== "production",
    port: env.PORT,
    hostname: env.HOSTNAME,
});
const nextHandler = nextApp.getRequestHandler();
const aetherHandler = createHTTPHandler({
    app,
    createContext,
    prefix: "/aether",
});

logger.info(`Starting server in ${env.NODE_ENV} mode`);

nextApp.prepare().then(() => {
    const server = createServer((req, res) => {
        if (req.url?.startsWith("/aether")) {
            return aetherHandler(req, res);
        }
        return nextHandler(req, res);
    });
    server.listen(env.PORT, () => {
        logger.info(`Server listening on http://${env.HOSTNAME}:${env.PORT}`);
    });
});
