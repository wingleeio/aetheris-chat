import "dotenv/config";

import { env } from "@/env.server";
import { logger } from "@/lib/logger";
import { app } from "@/server";
import { createContext } from "@/server/aether";
import { createHTTPHandler } from "@aetheris/server/adapters/http";
import { applyWSSHandler } from "@aetheris/server/adapters/ws";
import { createServer } from "http";
import next from "next";
import { WebSocket } from "ws";

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

logger.info(`Aetheris Chat`);
logger.info(`Starting server in ${env.NODE_ENV} mode`);

nextApp.prepare().then(() => {
    const server = createServer((req, res) => {
        if (req.url?.startsWith("/aether")) {
            return aetherHandler(req, res);
        }
        return nextHandler(req, res);
    });

    const wss = new WebSocket.Server(env.NODE_ENV === "production" ? { server } : { port: env.PORT + 1 });

    applyWSSHandler({
        app,
        wss,
        createContext,
    });

    server.on("upgrade", (req, socket, head) => {
        if (req.url === "/aether") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });

    if (env.NODE_ENV === "production") {
        const originalOn = server.on.bind(server);

        server.on = function (event, listener) {
            return event !== "upgrade" ? originalOn(event, listener) : server;
        };
    }

    server.listen(env.PORT, () => {
        logger.info(`Server listening on http://${env.HOSTNAME}:${env.PORT}`);
    });
});
