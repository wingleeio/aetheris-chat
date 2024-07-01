import { userVerifiedAction } from "@/server/aether";
import { ApiError } from "next/dist/server/api-utils";
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
            return page;
        },
    }),
    sendMessageToChannel: userVerifiedAction.handler({
        input: z.object({
            channel_id: z.string(),
            content: z.string(),
        }),
        resolve: async ({ database, input }) => {
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

            return message;
        },
    }),
};
