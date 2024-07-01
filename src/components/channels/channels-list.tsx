"use client";

import { FaHashtag } from "react-icons/fa";
import { Fragment } from "react";
import Link from "next/link";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const ChannelsList = ({ id }: { id: string }) => {
    const params = useParams<{ channel?: string }>();
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
                        channel.id === params.channel ? "bg-background" : ""
                    )}
                >
                    <FaHashtag /> {channel.name}
                </Link>
            ))}
        </Fragment>
    );
};
