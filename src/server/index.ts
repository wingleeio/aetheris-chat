import { action } from "@/server/aether";
import { router } from "@aetheris/server";

export const app = router({
    test: action.handler({
        resolve: async () => {
            return {
                message: "Hello, World!",
            };
        },
    }),
});

export type App = typeof app;
