"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FaUsers } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { RiArrowRightLine } from "react-icons/ri";
import { client, useAetherisContext } from "@/lib/client";
import { toast } from "sonner";
import { helpers } from "@/lib/api";

export const CommunityJoinCard = () => {
    const params = useParams<{ community: string }>();
    const { queryClient } = useAetherisContext();
    const router = useRouter();
    const { data: community } = client.communities.getCommunity.useQuery({
        input: {
            id: params.community,
        },
    });
    const joinCommunity = client.communities.joinCommunity.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getMyCommunities.getQueryKey(),
            });
            router.push(`/community/${params.community}`);
        },
        onError: (error) => {
            toast.error("Error joining", {
                description: error.message,
            });
        },
    });
    if (!community) return null;
    return (
        <div className="h-full flex justify-center items-center">
            <div className="rounded-sm overflow-hidden border border-muted text-sm text-muted-foreground cursor-pointer min-w-[350px] mx-auto bg-background z-10 relative shadow-lg">
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
                    <div className="font-semibold mb-4 flex gap-2 justify-center items-center">
                        <div>{community.name}</div>
                        <div className="text-muted-foreground flex gap-2 items-center text-xs font-normal">
                            <FaUsers />
                            <div>
                                {community.member_count} member{community.member_count > 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                    <div className="min-h-[100px]">{community.about}</div>
                    <div>
                        <Button
                            className="w-full gap-2"
                            disabled={joinCommunity.isPending}
                            onClick={() =>
                                joinCommunity.mutate({
                                    id: params.community,
                                })
                            }
                        >
                            Join Community
                            {joinCommunity.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RiArrowRightLine />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
