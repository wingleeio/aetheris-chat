"use client";

import { ChannelContext } from "@/components/channels/channel-context";
import { ChannelMessageInput } from "@/components/channels/channel-message-input";
import { ChannelMessages } from "@/components/channels/channel-messages";
import { api } from "@/lib/api";
import { useState } from "react";

type Message = Awaited<ReturnType<typeof api.channels.getMessageFromChannel>>["messages"][0];

export const ChannelBody = () => {
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    return (
        <ChannelContext.Provider
            value={{
                replyingTo,
                setReplyingTo,
            }}
        >
            <div className="px-4 pb-4 flex flex-col flex-grow">
                <ChannelMessages />
                <ChannelMessageInput />
            </div>
        </ChannelContext.Provider>
    );
};
