import { createContext } from "react";
import { api } from "@/lib/api";

type ChannelContextType = {
    replyingTo: Awaited<ReturnType<typeof api.channels.getMessageFromChannel>>["messages"][0] | null;
    setReplyingTo: (
        message: Awaited<ReturnType<typeof api.channels.getMessageFromChannel>>["messages"][0] | null
    ) => void;
};

export const ChannelContext = createContext<ChannelContextType>({} as ChannelContextType);
