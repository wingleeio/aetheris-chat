import { database } from "@/lib/database";
import { EventEmitter } from "tsee";

export type Events = {
    message: (channel: string, message: Awaited<ReturnType<typeof database.sendChannelMessage>>) => void;
    unreadCommunityChannel: (community: string, channel: string, sender: string) => void;
    unreadCommunity: (community: string, channel: string, sender: string) => void;
};

export const events = new EventEmitter<Events>();
