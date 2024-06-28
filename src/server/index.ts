import { auth } from "@/server/routers/auth";
import { communities } from "@/server/routers/communities";
import { user } from "@/server/routers/user";
import { router } from "@aetheris/server";

export const app = router({
    auth,
    communities,
    user,
});

export type App = typeof app;
