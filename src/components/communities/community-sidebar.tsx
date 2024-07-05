"use client";

import { ChannelsList } from "@/components/channels/channels-list";
import { CommunityBanner } from "@/components/communities/community-banner";
import { MyProfile } from "@/components/profile/my-profile";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const CommunitySidebar = () => {
    const params = useParams<{ community: string; channel: string }>();

    return (
        <div
            className={cn(
                "min-w-full sm:min-w-[300px] flex flex-col overflow-hidden transition-all",
                params.channel && "min-w-[0px] w-0 md:min-w-[300px] md:w-auto"
            )}
        >
            <div className="flex-grow text-sm flex flex-col">
                <CommunityBanner id={params.community} />
                <ChannelsList id={params.community} />
            </div>
            <MyProfile />
        </div>
    );
};
