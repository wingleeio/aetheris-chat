"use client";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const CommunityMessages = ({ children }: { children: React.ReactNode }) => {
    const params = useParams<{ channel: string }>();

    return (
        <div className={cn("bg-background flex-grow hidden sm:flex flex-col", params.channel && "flex")}>
            {children}
        </div>
    );
};
