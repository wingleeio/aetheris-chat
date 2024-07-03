"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/client";
import { CommunityListItem } from "@/components/communities/community-list-item";

export const CommunitiesList = () => {
    const { data } = client.communities.getCommunities.useQuery();

    if (!data) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="grid grid-flow-row auto-cols-fr gap-2"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
        >
            {data.map((community) => (
                <CommunityListItem key={community.id} community={community} />
            ))}
        </div>
    );
};
