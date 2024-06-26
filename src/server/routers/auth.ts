import { action } from "@/server/aether";
import { z } from "zod";

export const auth = {
    login: action.handler({
        input: z.object({
            email: z.string().email(),
            password: z.string(),
        }),
        resolve: async ({ input }) => {
            return {
                message: "Wow, you've just logged in!",
            };
        },
    }),
};
