import { database } from "@/lib/database";
import { EventEmitter } from "tsee";

export type Events = {
    message: (channel: string, message: Awaited<ReturnType<typeof database.sendChannelMessage>>) => void;
};

export const events = new EventEmitter<Events>();
