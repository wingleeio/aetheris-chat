import { env } from "@/env.client";
import type { App } from "@/server";
import { createClient, httpLink, loggerLink, matchLink, wsLink } from "@aetheris/client";
import { createServerHelpers } from "@aetheris/react-query/server";

const getHttpLink = () => {
    return httpLink({
        baseUrl: env.NEXT_PUBLIC_URL,
        headers: async () => {
            if (typeof window === "undefined") {
                return import("next/headers").then(({ headers }) => headers());
            }
        },
    });
};

const getWsLink = () => {
    return wsLink({
        baseUrl: env.NEXT_PUBLIC_WS_URL,
        lazy: true,
    });
};

export const api = createClient<App>({
    links: [
        loggerLink({
            enabled: typeof window !== "undefined",
        }),
        matchLink({
            match: ({ method }) => {
                if (method === "SUBSCRIBE" || method === "UNSUBSCRIBE") {
                    return "ws";
                }
                return "http";
            },
            links: {
                ws: typeof window === "undefined" ? getHttpLink() : getWsLink(),
                http: getHttpLink(),
            },
        }),
    ],
});

export const helpers = createServerHelpers(api);
