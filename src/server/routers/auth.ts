import { action, userRequiredAction } from "@/server/aether";
import { z } from "zod";

export const auth = {
    signIn: action.handler({
        input: z.object({
            email: z.string().email(),
            password: z.string(),
        }),
        resolve: async ({ input, user }) => {
            return {
                message: "Wow, you've just signed in!",
            };
        },
    }),
    signUp: action.handler({
        input: z.object({
            email: z.string().email(),
            password: z.string(),
        }),
        resolve: async ({ input }) => {
            return {
                message: "Wow, you've just signed up!",
            };
        },
    }),
    signOut: userRequiredAction.handler({
        resolve: async () => {
            return {
                message: "Wow, you've just signed out!",
            };
        },
    }),
    verifyEmail: action.handler({
        input: z.object({
            token: z.string(),
        }),
        resolve: async ({ input }) => {
            return {
                message: "Wow, you've just verified your email!",
            };
        },
    }),
    resendVerificationEmail: action.handler({
        input: z.object({
            email: z.string().email(),
        }),
        resolve: async ({ input }) => {
            return {
                message: "Wow, you've just resent your verification email!",
            };
        },
    }),
    getSession: action.handler({
        resolve: async () => {
            return {
                message: "Wow, you've just got your session!",
            };
        },
    }),
};
