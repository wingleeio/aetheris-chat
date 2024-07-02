import { env } from "@/env.server";
import { api } from "@/lib/api";
import { createRouteMatcher } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/signUp", "/signIn"];
const PROTECTED_ROUTES = ["/verify"];

const isProtectedRoute = createRouteMatcher(PROTECTED_ROUTES);
const isPublicRoute = createRouteMatcher(PUBLIC_ROUTES);

export async function middleware(req: NextRequest) {
    if (!req.cookies.has(env.AUTH_COOKIE)) {
        return NextResponse.next();
    }
    const headers = new Headers(req.headers);

    const session = await api.auth.getSession();

    if (isProtectedRoute(req) && !session) {
        return NextResponse.redirect(new URL("/signIn", req.url));
    }

    if (isPublicRoute(req) && session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (session) {
        headers.set(env.AUTH_HEADER, JSON.stringify(session));
    }

    return NextResponse.next({
        request: {
            headers,
        },
    });
}

export const config = {
    matcher: "/((?!api|oauth|_next/static|_next/image|favicon.ico).*)",
};
