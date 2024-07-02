import { database } from "@/lib/database";
import { events } from "@/lib/events";
import { files } from "@/lib/files";
import { logger } from "@/lib/logger";
import { ApiError } from "@/server/error";
import { lucia } from "@/services/lucia";
import { resend } from "@/services/resend";
import { createAetheris } from "@aetheris/server";
import { IncomingMessage } from "http";

export const createContext = (req: IncomingMessage) => ({
    ip: req.socket.remoteAddress,
    logger,
    database,
    events,
    files,
    service: {
        lucia,
        resend,
    },
});

const aether = createAetheris<typeof createContext>();

export const action = aether
    .use(({ logger, path, ip }) => {
        let childLogger = logger.child({ path, ip });
        childLogger.info("Received request");
        return {
            logger: childLogger,
        };
    })
    .use(async ({ service, cookies }) => {
        const sessionId = cookies.get(service.lucia.sessionCookieName);

        if (!sessionId) {
            return {
                user: null,
                sessionId: null,
            };
        }

        const { session, user } = await service.lucia.validateSession(sessionId);

        if (session && session.fresh) {
            const cookie = service.lucia.createSessionCookie(session.id);
            cookies.set(cookie.name, cookie.value, cookie.attributes);
        }

        if (!session) {
            cookies.delete(service.lucia.sessionCookieName);
            return {
                user: null,
                sessionId: null,
            };
        }

        return {
            user,
            sessionId,
        };
    });

export const userRequiredAction = action.use(({ user, sessionId, database }) => {
    if (!user || !sessionId) {
        throw new ApiError(401, "You must be signed in to perform this action");
    }

    return {
        user,
        sessionId,
        database: database.withGlobals({ current_user_id: user.id }),
    };
});

export const userVerifiedAction = userRequiredAction.use(({ user }) => {
    if (!user.email_verified) {
        throw new ApiError(403, "You must verify your email to perform this action");
    }
});
