import { auth } from "@/server/routers/auth";
import { communities } from "@/server/routers/communities";
import { router } from "@aetheris/server";

export const app = router({
    auth,
    communities,
});

export type App = typeof app;
