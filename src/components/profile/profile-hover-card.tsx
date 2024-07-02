import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { CalendarDays } from "lucide-react";
import { api } from "@/lib/api";

export function ProfileHoverCard({
    children,
    profile,
}: {
    children: React.ReactNode;
    profile: NonNullable<Awaited<ReturnType<typeof api.user.getProfile>>>;
}) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 overflow-hidden border-0" side="right">
                <div
                    style={{
                        backgroundImage: `url(${profile.cover_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="bg-indigo-500 h-24 position relative mb-[16px] p-2"
                >
                    <div
                        style={{
                            backgroundImage: `url(${profile.avatar_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="bg-indigo-500 h-[96px] w-[96px] rounded-full p-[3px] absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 border-[3px] border-background"
                    ></div>
                </div>
                <div className="p-4">
                    <div className="flex justify-center flex-col items-center font-semibold mb-4">
                        {profile.display_name}
                        <div className="flex items-center font-normal">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">Joined December 2021</span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
