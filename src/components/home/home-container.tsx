"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const HomeContainer = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const notRoot = pathname !== "/";

    return <div className={cn("p-4 bg-background flex-grow hidden sm:block", notRoot && "block")}>{children}</div>;
};
