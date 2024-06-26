import { action } from "@/server/aether";
import { auth } from "@/server/routers/auth";
import { router } from "@aetheris/server";

export const app = router({
    test: action.handler({
        resolve: async () => {
            return {
                message: "Hello, World!",
            };
        },
    }),
    auth,
});

export type App = typeof app;
