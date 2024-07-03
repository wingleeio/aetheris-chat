"use client";

import { client } from "@/lib/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaCaretSquareLeft, FaHashtag } from "react-icons/fa";

export const ChannelBanner = () => {
    const params = useParams<{ community: string; channel: string }>();
    const channel = client.channels.getChannel.useQuery({
        input: {
            channel_id: params.channel,
        },
    });

    if (!channel.data) {
        return null;
    }

    return (
        <div className="flex gap-4 items-center text-muted-foreground p-4 bg-primary-foreground text-sm shadow-sm">
            <Link href={`/community/${params.community}`} className="block sm:hidden">
                <FaCaretSquareLeft />
            </Link>
            <FaHashtag /> {channel.data.name}
        </div>
    );
};
