"use client";
import { Message } from "@/components/shared/message";
import { DEFAULT_ID } from "@/constants";
import { client } from "@/lib/client";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export const ChannelMessages = () => {
    const params = useParams<{ channel: string }>();
    const channel = client.channels.getChannel.useQuery({
        input: {
            channel_id: params.channel,
        },
    });
    const messages = client.channels.getMessageFromChannel.useInfiniteQuery({
        input: {
            channel_id: params.channel,
        },
        getNextPageParam: (lastPage) => lastPage.messages[lastPage.messages.length - 1]?.id ?? DEFAULT_ID,
        initialPageParam: DEFAULT_ID,
    });
    if (!messages.data || !channel.data) {
        return null;
    }
    return (
        <div className="flex-grow relative">
            <div className="absolute inset-0 overflow-auto flex flex-col-reverse gap-4">
                {messages.data.pages.map((page, i) => (
                    <Fragment key={i}>
                        {page.messages.map((message) => (
                            <Fragment key={message.id}>
                                <Message message={message} />
                            </Fragment>
                        ))}
                        {!page.has_more && (
                            <div className="text-muted-foreground">
                                <div className="font-semibold"># {channel.data.name}</div>
                                <div>This is the start of the conversation.</div>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
