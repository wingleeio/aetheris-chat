"use client";

import { CommunityHoverCard } from "@/components/communities/community-hover-card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { client, useAetherisContext } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile } from "console";

export const MyCommunities = () => {
    const params = useParams<{ community?: string; channel?: string }>();
    const { queryClient } = useAetherisContext();
    const { data, queryKey } = client.communities.getMyCommunities.useQuery();

    client.communities.listenForUnreadCommunities.useSubscription({
        dependencies: [params.channel],
        onMessage: ({ community_id, channel_id }) => {
            if (params.channel !== channel_id) {
                queryClient.setQueryData(queryKey, (communities: NonNullable<typeof data>) => {
                    return communities.map((c) => {
                        if (c.id === community_id) {
                            return {
                                ...c,
                                has_unread: true,
                            };
                        }
                        return c;
                    });
                });
            }
        },
    });

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col gap-2 pl-4 pr-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
            </div>
        );
    }
    return (
        <div className="absolute inset-0 overflow-y-scroll overflow-x-visible">
            <div className="flex flex-col gap-2 items-center pl-4 pr-2">
                {data.map((community) => (
                    <CommunityHoverCard key={community.id} community={community}>
                        <Link href={`/community/${community.id}`} className="relative">
                            <Avatar
                                className={cn(
                                    "w-12 h-12 transition-all relative",
                                    params.community === community.id && "rounded-lg",
                                    params.community !== community.id && "rounded-3xl hover:rounded-xl"
                                )}
                            >
                                <AvatarImage src={community.icon_url ?? ""} />
                                <AvatarFallback>{community.name}</AvatarFallback>
                            </Avatar>
                            {community.has_unread && (
                                <div className="w-3 h-3 bg-indigo-500 rounded-full absolute top-[50%] translate-y-[-50%] left-[-23px] z-10" />
                            )}
                        </Link>
                    </CommunityHoverCard>
                ))}
            </div>
        </div>
    );
};
