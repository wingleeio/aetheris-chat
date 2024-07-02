import { FaUsers } from "react-icons/fa";
import { RiBarChart2Fill } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import Link from "next/link";

export const CommunityListItem = ({
    community,
}: {
    community: Awaited<ReturnType<typeof api.communities.getCommunities>>[0];
}) => {
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
        <Link
            className="rounded-sm overflow-hidden border border-muted text-sm text-muted-foreground cursor-pointer hover:shadow-sm"
            href={community.is_member ? `/community/${community.id}` : `/join/${community.id}`}
        >
            <div
                style={{
                    backgroundImage: `url(${community.cover_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="bg-indigo-500 h-24 position relative mb-[16px] p-2"
            >
                {community.is_member && (
                    <div className="flex flex-row-reverse">
                        <Badge className="rounded-sm">Joined</Badge>
                    </div>
                )}
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
                <div className="min-h-[100px]">{community.about}</div>
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
        </Link>
    );
};
