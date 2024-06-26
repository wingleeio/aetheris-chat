import { headers } from "next/headers";
import { api } from "@/lib/api";
import { env } from "@/env.server";

type UserFromSession = Awaited<ReturnType<typeof api.auth.getSession>>;

export type AuthResult =
    | {
          user: NonNullable<UserFromSession>;
          isAuthenticated: true;
      }
    | {
          user: null;
          isAuthenticated: false;
      };

export const auth = (): AuthResult => {
    const data = headers().get(env.AUTH_HEADER);

    if (data) {
        return {
            user: JSON.parse(data),
            isAuthenticated: true,
        };
    }

    return {
        user: null,
        isAuthenticated: false,
    };
};
