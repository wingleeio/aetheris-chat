import { OAuthProvider, oauth } from "@/lib/oauth";

import { cookies } from "next/headers";
import { generateState } from "arctic";

type RouteConfig = {
    params: {
        provider: OAuthProvider;
    };
};

export async function GET(_: Request, { params }: RouteConfig): Promise<Response> {
    const state = generateState();
    const provider = oauth[params.provider];
    const url = await provider.client.createAuthorizationURL(state, {
        scopes: provider.scopes,
    });

    cookies().set("oauth_provider", params.provider, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    cookies().set("oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    });

    return Response.redirect(url);
}
