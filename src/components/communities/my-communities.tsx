"use client";

import { CommunityHoverCard } from "@/components/communities/community-hover-card";
import { Fragment } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const MyCommunities = () => {
    const params = useParams<{ community?: string }>();
    const { data } = client.communities.getMyCommunities.useQuery();
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
            </div>
        );
    }
    return (
        <div className="absolute inset-0 overflow-scroll">
            <div className="flex flex-col gap-2">
                {data.map((community) => (
                    <CommunityHoverCard key={community.id} community={community}>
                        <Link
                            href={`/community/${community.id}`}
                            className={cn(
                                "w-12 h-12 transition-all",
                                params.community === community.id && "rounded-lg",
                                params.community !== community.id && "rounded-3xl hover:rounded-xl"
                            )}
                            style={{
                                backgroundImage: `url(${community.icon_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    </CommunityHoverCard>
                ))}
            </div>
        </div>
    );
};
