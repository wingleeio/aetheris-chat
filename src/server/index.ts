import { auth } from "@/server/routers/auth";
import { channels } from "@/server/routers/channels";
import { communities } from "@/server/routers/communities";
import { user } from "@/server/routers/user";
import { router } from "@aetheris/server";

export const app = router({
    auth,
    communities,
    channels,
    user,
});

export type App = typeof app;
