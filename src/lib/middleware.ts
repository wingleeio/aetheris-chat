import { NextRequest } from "next/server";

export const createRouteMatcher = (patterns: string[]) => {
    const regexes = patterns.map((pattern) => new RegExp(`^${pattern}$`));

    return (req: NextRequest) => {
        const pathname = req.nextUrl.pathname;
        return regexes.some((regex) => regex.test(pathname));
    };
};
