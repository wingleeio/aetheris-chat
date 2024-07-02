"use client";

import { EditIcon, PlusIcon } from "lucide-react";

import { AddChannelDialog } from "@/components/channels/add-channel-dialog";
import { EditCommunityDialog } from "@/components/communities/edit-community-dialog";
import { client } from "@/lib/client";
import { useAuth } from "@/hooks/use-auth";

export const CommunityBanner = ({ id }: { id: string }) => {
    const session = useAuth();
    const { data } = client.communities.getCommunity.useQuery({
        input: {
            id,
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
            className="rounded-sm relative overflow-hidden mb-2"
        >
            <div className="p-2 text-white h-28 flex flex-col z-10 relative">
                <div className="flex-grow" />
                <div className="flex text-sm items-center gap-2">
                    <div>{data?.name}</div>
                    <div className="flex-grow" />
                    {data?.owner_id === session?.user?.id && (
                        <AddChannelDialog id={id}>
                            <button>
                                <PlusIcon />
                            </button>
                        </AddChannelDialog>
                    )}
                    {data?.owner_id === session?.user?.id && (
                        <EditCommunityDialog
                            id={id}
                            defaultValues={{
                                name: data.name,
                                about: data.about,
                                icon: data.icon_url ?? undefined,
                                cover: data.cover_url ?? undefined,
                            }}
                        >
                            <button>
                                <EditIcon />
                            </button>
                        </EditCommunityDialog>
                    )}
                </div>
            </div>
            <div className="bg-gradient-to-t from-black/70 to-white/0 absolute inset-0"></div>
        </div>
    );
};
