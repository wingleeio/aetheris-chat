import { OAuthProvider, oauth } from "@/lib/oauth";

import { CreateUserReturns } from "@/edgedb";
import { cookies } from "next/headers";
import { database } from "@/lib/database";
import { lucia } from "@/services/lucia";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedProvider = cookies().get("oauth_provider")?.value as OAuthProvider;
    const storedState = cookies().get("oauth_state")?.value;

    if (!code || !state || !storedProvider || !storedState || state !== storedState) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/login?error=oauth_error",
            },
        });
    }

    const provider = oauth[storedProvider];
    const tokens = await provider.client.validateAuthorizationCode(code);
    const { id, email } = await provider.getAttributes(tokens.accessToken);

    if (!email || !id) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/login?error=oauth_error",
            },
        });
    }

    const oAuthAccount = await database.getOauthAccount({
        provider_user_id: `${storedProvider}:${id}`,
    });

    if (oAuthAccount) {
        const session = await lucia.createSession(oAuthAccount.user_id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    }

    let user: CreateUserReturns;

    try {
        user = await database.transaction(async (tx) => {
            const user = await tx.createUser({
                email,
                email_verified: true,
            });
            await tx.createOauthAccount({
                provider: storedProvider,
                provider_user_id: `${storedProvider}:${id}`,
                user_id: user.id,
            });

            return user;
        });
    } catch (e) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/login?error=oauth_error",
            },
        });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
        },
    });
}
