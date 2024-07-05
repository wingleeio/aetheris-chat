"use client";

import { FaHashtag, FaTrash } from "react-icons/fa";
import { client, useAetherisContext } from "@/lib/client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Fragment } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const ChannelsList = ({ id }: { id: string }) => {
    const session = useAuth();
    const params = useParams<{ channel?: string }>();
    const { queryClient } = useAetherisContext();
    const { data, queryKey } = client.channels.getChannels.useQuery({
        input: {
            community_id: id,
        },
        gcTime: 0,
    });

    const deleteChannel = client.channels.deleteChannel.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKey,
            });
        },
    });

    client.channels.listenForUnreadChannelMessages.useSubscription({
        input: {
            community_id: id,
        },
        dependencies: [params.channel],
        onMessage: (channelId) => {
            if (channelId !== params.channel) {
                queryClient.setQueryData(queryKey, (channels: NonNullable<typeof data>) => {
                    return channels.map((channel) => {
                        if (channel.id === channelId) {
                            return {
                                ...channel,
                                unread_count: channel.unread_count + 1,
                            };
                        }
                        return channel;
                    });
                });
            }
        },
    });

    return (
        <Fragment>
            {data?.map((channel) => (
                <Link
                    key={channel.id}
                    href={`/community/${id}/channel/${channel.id}`}
                    className={cn(
                        "flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2 group relative",
                        channel.id === params.channel ? "bg-background" : "",
                        channel.unread_count > 0 && "font-semibold text-foreground"
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
                    {channel.unread_count > 0 && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                </Link>
            ))}
        </Fragment>
    );
};
