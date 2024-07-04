import { TimeSpan, createDate } from "oslo";
import { action, userRequiredAction } from "@/server/aether";
import { alphabet, generateRandomString } from "oslo/crypto";
import { hash, verify } from "@node-rs/argon2";

import { ApiError } from "@/server/error";
import { EmailVerification } from "@/emails/email-verification";
import { env } from "@/env.server";
import { z } from "zod";

export const auth = {
    signIn: action.handler({
        input: z.object({
            email: z.string().email(),
            password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/),
        }),
        resolve: async ({ input, database, service, cookies }) => {
            const user = await database.getUserWithHashedPassword({ email: input.email });

            if (!user || !user.hashed_password) {
                throw new ApiError(401, "Invalid email or password.");
            }

            const verified = await verify(user.hashed_password, input.password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            });

            if (!verified) {
                throw new ApiError(401, "Invalid email or password.");
            }

            const session = await service.lucia.createSession(user.id, {});
            const cookie = service.lucia.createSessionCookie(session.id);

            cookies.set(cookie.name, cookie.value, cookie.attributes);
        },
    }),
    signUp: action.handler({
        input: z.object({
            email: z.string().email(),
            password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/),
        }),
        resolve: async ({ input, database, service, cookies }) => {
            const hashedPassword = await hash(input.password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            });

            const user = await database.transaction(async (tx) => {
                const user = await tx
                    .createUser({
                        email: input.email,
                        hashed_password: hashedPassword,
                        email_verified: false,
                    })
                    .catch(() => {
                        throw new ApiError(422, "Email is already in use.");
                    });

                const emailVerification = await tx.createEmailVerification({
                    code: generateRandomString(8, alphabet("0-9")),
                    user_id: user.id,
                    expires_at: createDate(new TimeSpan(15, "m")),
                });

                const { error } = await service.resend.emails.send({
                    from: `Aetheris Chat <${env.EMAIL}>`,
                    to: [input.email],
                    subject: "Verify your email address",
                    react: EmailVerification({ code: emailVerification.code }),
                });

                if (error) {
                    throw new ApiError(500, "Failed to send email verification.");
                }

                return user;
            });

            const session = await service.lucia.createSession(user.id, {});
            const cookie = service.lucia.createSessionCookie(session.id);

            cookies.set(cookie.name, cookie.value, cookie.attributes);
        },
    }),
    signOut: userRequiredAction.handler({
        resolve: async ({ service, cookies, sessionId }) => {
            const { session } = await service.lucia.validateSession(sessionId);

            if (session) {
                cookies.delete(service.lucia.sessionCookieName);
                await service.lucia.invalidateSession(session.id);
            }
        },
    }),
    verifyEmail: userRequiredAction.handler({
        input: z.object({
            code: z.string(),
        }),
        resolve: async ({ user, database, input }) => {
            if (user?.email_verified) {
                throw new ApiError(422, "Email is already verified.");
            }

            await database.transaction(async (tx) => {
                const verified = await tx.verifyEmail({
                    code: input.code,
                });

                if (!verified) {
                    throw new ApiError(422, "Invalid verification token.");
                }

                await tx.updateUser({ user_id: user.id, email_verified: true });

                await tx.deleteEmailVerificationCodes({ user_id: user.id });
            });
        },
    }),
    resendVerificationEmail: userRequiredAction.handler({
        resolve: async ({ user, database, service }) => {
            if (user?.email_verified) {
                throw new ApiError(422, "Email is already verified.");
            }

            await database.transaction(async (tx) => {
                await tx.deleteEmailVerificationCodes({ user_id: user.id });

                const emailVerification = await tx.createEmailVerification({
                    code: generateRandomString(8, alphabet("0-9")),
                    user_id: user.id,
                    expires_at: createDate(new TimeSpan(15, "m")),
                });

                const { error } = await service.resend.emails.send({
                    from: `Aetheris Chat <${env.EMAIL}>`,
                    to: [user.email],
                    subject: "Verify your email address",
                    react: EmailVerification({ code: emailVerification.code }),
                });

                if (error) {
                    throw new ApiError(500, "Failed to send email verification.");
                }
            });
        },
    }),
    getSession: action.handler({
        resolve: async ({ user }) => user,
    }),
};
