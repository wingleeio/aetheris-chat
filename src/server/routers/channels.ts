import { ApiError } from "next/dist/server/api-utils";
import { Events } from "@/lib/events";
import { userVerifiedAction } from "@/server/aether";
import { z } from "zod";

export const channels = {
    getChannel: userVerifiedAction.handler({
        input: z.object({
            channel_id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            const channel = await database.transaction(async (tx) => {
                const isChannelMember = await tx.isChannelMember({
                    channel_id: input.channel_id,
                });

                if (!isChannelMember) {
                    throw new ApiError(403, "You must be a member of the community to view this channel.");
                }

                return tx.getChannel({
                    channel_id: input.channel_id,
                });
            });

            if (!channel) {
                throw new ApiError(404, "Channel not found");
            }

            return channel;
        },
    }),
    getChannels: userVerifiedAction.handler({
        input: z.object({
            community_id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            const channels = await database.transaction(async (tx) => {
                const isCommunityMember = await tx.isCommunityMember({
                    community_id: input.community_id,
                });

                if (!isCommunityMember) {
                    throw new ApiError(403, "You must be a member of the community to view its channels");
                }

                return tx.getChannels({
                    community_id: input.community_id,
                });
            });

            return channels;
        },
    }),
    getMessageFromChannel: userVerifiedAction.handler({
        input: z.object({
            cursor: z.string().optional(),
            channel_id: z.string(),
            take: z.number().default(30).optional(),
        }),
        resolve: async ({ database, input }) => {
            const page = await database.transaction(async (tx) => {
                const isChannelMember = await tx.isChannelMember({
                    channel_id: input.channel_id,
                });

                if (!isChannelMember) {
                    throw new ApiError(403, "You must be a member of the community to view this channel.");
                }

                return tx.getMessagesByChannel({
                    cursor: input.cursor,
                    channel_id: input.channel_id,
                    take: input.take,
                });
            });
            return {
                messages: page.messages.sort((a, b) => a.created_at.getTime() - b.created_at.getTime()),
                has_more: page.has_more,
            };
        },
    }),
    sendMessageToChannel: userVerifiedAction.handler({
        input: z.object({
            channel_id: z.string(),
            content: z.string(),
        }),
        resolve: async ({ database, input, events }) => {
            const message = await database.transaction(async (tx) => {
                const isChannelMember = await tx.isChannelMember({
                    channel_id: input.channel_id,
                });

                if (!isChannelMember) {
                    throw new ApiError(403, "You must be a member of the community to send messages to this channel.");
                }

                return tx.sendChannelMessage({
                    channel_id: input.channel_id,
                    content: input.content,
                });
            });
            events.emit("message", input.channel_id, message);
            return message;
        },
    }),
    listenToChannelMessages: userVerifiedAction.subscription({
        input: z.object({
            channel_id: z.string(),
        }),
        output: z.object({
            id: z.string(),
            sender_id: z.string(),
            content: z.string(),
            created_at: z.date(),
            updated_at: z.date(),
        }),
        resolve: async ({ database, input, emit, events }) => {
            const isChannelMember = await database.isChannelMember({
                channel_id: input.channel_id,
            });

            if (!isChannelMember) {
                throw new ApiError(403, "You must be a member of the community to listen to this channel.");
            }

            const onMessage: Events["message"] = (channel, message) => {
                if (channel === input.channel_id) {
                    emit(message);
                }
            };

            events.on("message", onMessage);

            return () => {
                events.off("message", onMessage);
            };
        },
    }),
    deleteChannel: userVerifiedAction.handler({
        input: z.object({
            channel_id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            await database.transaction(async (tx) => {
                const isAllowed = await tx.isAllowedToDeleteChannel({
                    channel_id: input.channel_id,
                });

                if (!isAllowed) {
                    throw new ApiError(403, "You must be the owner of the community to delete this channel.");
                }

                await tx.deleteChannelMessages({
                    channel_id: input.channel_id,
                });

                await tx.deleteChannel({
                    channel_id: input.channel_id,
                });
            });
        },
    }),
    createChannel: userVerifiedAction.handler({
        input: z.object({
            community_id: z.string(),
            name: z.string(),
        }),
        resolve: async ({ database, input }) => {
            const channel = await database.transaction(async (tx) => {
                const isAllowed = await tx.isAllowedToUpdateCommunity({
                    community_id: input.community_id,
                });

                if (!isAllowed) {
                    throw new ApiError(403, "You must be the owner of the community to create a channel.");
                }

                return await tx.createChannel({
                    community_id: input.community_id,
                    name: input.name,
                });
            });

            return channel;
        },
    }),
};
