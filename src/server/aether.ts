import { database } from "@/lib/database";
import { logger } from "@/lib/logger";
import { lucia } from "@/services/lucia";
import { resend } from "@/services/resend";
import { AetherisError, createAetheris } from "@aetheris/server";

export const createContext = () => ({
    logger,
    database,
    service: {
        lucia,
        resend,
    },
});

const aether = createAetheris<typeof createContext>();

export const action = aether
    .use(({ logger, path, input }) => {
        logger.info(input, `Received request to ${path}`);
    })
    .use(async ({ service, cookies }) => {
        const sessionId = cookies.get(service.lucia.sessionCookieName);

        if (!sessionId) {
            return {
                user: null,
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
            };
        }

        return {
            user,
        };
    });

export const userRequiredAction = action.use(({ user }) => {
    if (!user) {
        throw new AetherisError({
            status: 401,
            message: "You must be signed in to perform this action",
        });
    }
    return user;
});
