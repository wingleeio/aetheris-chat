import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { FaUsers } from "react-icons/fa";
import { RiBarChart2Fill } from "react-icons/ri";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function CommunityHoverCard({
    children,
    community,
}: {
    children: React.ReactNode;
    community: Awaited<ReturnType<typeof api.communities.getMyCommunities>>[0];
}) {
    let activityMessage = "Low activity";
    let activityColor = "text-muted-foreground/50";

    if (community.messages_since_yesterday > 100) {
        activityMessage = "High activity";
        activityColor = "text-green-500";
    } else if (community.messages_since_yesterday > 20) {
        activityMessage = "Medium activity";
        activityColor = "text-yellow-500";
    }
    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 overflow-hidden border-0" side="right">
                <div
                    style={{
                        backgroundImage: `url(${community.cover_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    className="bg-indigo-500 h-24 position relative mb-[16px] p-2"
                >
                    <div
                        style={{
                            backgroundImage: `url(${community.icon_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="bg-indigo-500 h-[96px] w-[96px] rounded-full p-[3px] absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 border-[3px] border-background"
                    ></div>
                </div>
                <div className="p-4">
                    <div className="text-center font-semibold mb-4">{community.name}</div>
                    <div className="mt-6 flex justify-between">
                        <div className="text-muted-foreground flex gap-2 items-center text-xs">
                            <FaUsers />
                            <div>
                                {community.member_count} member{community.member_count > 1 ? "s" : ""}
                            </div>
                        </div>
                        <div className={cn("flex gap-2 items-center text-xs", activityColor)}>
                            <RiBarChart2Fill />
                            <div>{activityMessage}</div>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
