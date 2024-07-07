"use client";

import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const CommunityMessages = ({ children }: { children: React.ReactNode }) => {
    const params = useParams<{ channel: string }>();

    return (
        <div className={cn("bg-background flex-grow hidden sm:block relative", params.channel && "flex")}>
            <div className="flex flex-col absolute inset-0">{children}</div>
        </div>
    );
};
