import { auth } from "@/server/routers/auth";
import { router } from "@aetheris/server";

export const app = router({
    auth,
});

export type App = typeof app;
