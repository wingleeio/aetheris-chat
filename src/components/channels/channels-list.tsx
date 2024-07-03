"use client";

import { FaHashtag, FaTrash } from "react-icons/fa";
import { client, useAetherisContext } from "@/lib/client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Fragment } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";

export const ChannelsList = ({ id }: { id: string }) => {
    const session = useAuth();
    const params = useParams<{ channel?: string }>();
    const { queryClient } = useAetherisContext();
    const { data, queryKey } = client.channels.getChannels.useQuery({
        input: {
            community_id: id,
        },
    });

    const deleteChannel = client.channels.deleteChannel.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey,
            });
        },
    });

    return (
        <Fragment>
            {data?.map((channel) => (
                <Link
                    key={channel.id}
                    href={`/community/${id}/channel/${channel.id}`}
                    className={cn(
                        "flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2 rounded-sm group",
                        channel.id === params.channel ? "bg-background" : ""
                    )}
                >
                    <FaHashtag /> {channel.name}
                    <div className="flex-grow" />
                    {channel.owner_id === session?.user?.id && (
                        <ConfirmDialog
                            onConfirm={() =>
                                deleteChannel.mutate({
                                    channel_id: channel.id,
                                })
                            }
                            title="Are you sure?"
                            description="Deleting a channel is permanent and cannot be undone. All messages in the channel will be lost."
                        >
                            <div>
                                <FaTrash className="hidden group-hover:block hover:text-red-500" />
                            </div>
                        </ConfirmDialog>
                    )}
                </Link>
            ))}
        </Fragment>
    );
};