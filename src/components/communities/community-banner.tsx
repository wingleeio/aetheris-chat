"use client";

import { EditIcon, LogOut, PlusIcon, SmileIcon } from "lucide-react";

import { AddChannelDialog } from "@/components/channels/add-channel-dialog";
import { EditCommunityDialog } from "@/components/communities/edit-community-dialog";
import { client, useAetherisContext } from "@/lib/client";
import { useAuth } from "@/hooks/use-auth";
import { ConfirmDialog } from "../shared/confirm-dialog";
import { helpers } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { EmojiManagementDialog } from "@/components/communities/emoji-management-dialog";

export const CommunityBanner = () => {
    const params = useParams<{ community: string }>();
    const session = useAuth();
    const router = useRouter();
    const { queryClient } = useAetherisContext();
    const { data } = client.communities.getCommunity.useQuery({
        input: {
            id: params.community,
        },
    });

    const leaveCommunity = client.communities.leaveCommunity.useMutation({
        onSuccess: () => {
            router.replace("/");
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getMyCommunities.getQueryKey(),
            });
        },
    });

    if (!data) return null;

    return (
        <div
            style={{
                backgroundImage: `url(${data?.cover_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="relative overflow-hidden mb-2"
        >
            <div className="p-2 text-white h-28 flex flex-col z-10 relative">
                <div className="flex-grow" />
                <div className="flex text-sm items-center gap-2">
                    <div>{data?.name}</div>
                    <div className="flex-grow" />
                    {data?.owner_id === session?.user?.id && (
                        <AddChannelDialog id={params.community}>
                            <button>
                                <PlusIcon className="h-3 hover:text-indigo-300" />
                            </button>
                        </AddChannelDialog>
                    )}
                    {data?.owner_id === session?.user?.id && (
                        <EmojiManagementDialog>
                            <button>
                                <SmileIcon className="h-3 hover:text-indigo-300" />
                            </button>
                        </EmojiManagementDialog>
                    )}
                    {data?.owner_id === session?.user?.id && (
                        <EditCommunityDialog
                            id={params.community}
                            defaultValues={{
                                name: data.name,
                                about: data.about,
                                icon: data.icon_url ?? undefined,
                                cover: data.cover_url ?? undefined,
                            }}
                        >
                            <button>
                                <EditIcon className="h-3 hover:text-indigo-300" />
                            </button>
                        </EditCommunityDialog>
                    )}
                    {data?.owner_id !== session?.user?.id && (
                        <ConfirmDialog
                            title="Leave community"
                            description="Are you sure you want to leave this community?"
                            onConfirm={() => {
                                leaveCommunity.mutate({
                                    id: params.community,
                                });
                            }}
                        >
                            <button>
                                <LogOut className="h-3 hover:text-indigo-300" />
                            </button>
                        </ConfirmDialog>
                    )}
                </div>
            </div>
            <div className="bg-gradient-to-t from-black/70 to-white/0 absolute inset-0"></div>
        </div>
    );
};
