"use client";

import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import Link from "next/link";
import { FaHashtag } from "react-icons/fa";

export const ChannelsList = ({ id, channelId }: { id: string; channelId?: string }) => {
    const { data } = client.channels.getChannels.useQuery({
        input: {
            community_id: id,
        },
    });

    return (
        <Fragment>
            {data?.map((channel) => (
                <Link
                    key={channel.id}
                    href={`/community/${id}/channel/${channel.id}`}
                    className={cn(
                        "flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2",
                        channel.id === channelId ? "bg-background" : ""
                    )}
                >
                    <FaHashtag /> {channel.name}
                </Link>
            ))}
        </Fragment>
    );
};
