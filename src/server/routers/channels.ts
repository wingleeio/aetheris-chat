import { ApiError } from "next/dist/server/api-utils";
import { Events } from "@/lib/events";
import { userVerifiedAction } from "@/server/aether";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

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

                await tx.markAsRead({
                    channel_id: input.channel_id,
                });

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
            temp_id: z.string(),
            channel_id: z.string(),
            message_id: z.string().optional(),
            reply_id: z.string().optional(),
            content: z.string(),
        }),
        resolve: async ({ database, input, events, user }) => {
            const results = await database.transaction(async (tx) => {
                const isChannelMember = await tx.isChannelMember({
                    channel_id: input.channel_id,
                });

                if (!isChannelMember) {
                    throw new ApiError(403, "You must be a member of the community to send messages to this channel.");
                }

                console.log(input);

                const message = await tx.sendChannelMessage({
                    channel_id: input.channel_id,
                    message_id: input.message_id,
                    content: sanitizeHtml(input.content, {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
                        allowedAttributes: {
                            ...sanitizeHtml.defaults.allowedAttributes,
                            span: ["data-type", "data-name"],
                        },
                    }),
                });

                const community = await tx.getCommunityFromChannel({
                    channel_id: input.channel_id,
                });

                return { message, community };
            });

            events.emit("message", input.channel_id, results.message, input.temp_id);
            events.emit("unreadCommunityChannel", results.community!.id, input.channel_id, user.id);
            events.emit("unreadCommunity", results.community!.id, input.channel_id, user.id);

            return results.message;
        },
    }),
    listenToChannelMessages: userVerifiedAction.subscription({
        input: z.object({
            channel_id: z.string(),
        }),
        output: z.object({
            id: z.string(),
            temp_id: z.string(),
            sender_id: z.string(),
            content: z.string(),
            created_at: z.date(),
            updated_at: z.date(),
            reply_to: z
                .object({
                    id: z.string(),
                    sender_id: z.string(),
                    content: z.string(),
                })
                .optional(),
            reactions: z.array(z.any()),
        }),
        resolve: async ({ database, input, emit, events }) => {
            const isChannelMember = await database.isChannelMember({
                channel_id: input.channel_id,
            });

            if (!isChannelMember) {
                throw new ApiError(403, "You must be a member of the community to listen to this channel.");
            }

            const onMessage: Events["message"] = async (channel, message, temp_id) => {
                if (channel === input.channel_id) {
                    await database
                        .markAsRead({
                            channel_id: input.channel_id,
                        })
                        .catch();

                    emit({
                        temp_id,
                        ...message,
                        reply_to: message.reply_to ?? undefined,
                    });
                }
            };

            events.on("message", onMessage);

            return () => {
                events.off("message", onMessage);
            };
        },
    }),
    listenForUnreadChannelMessages: userVerifiedAction.subscription({
        input: z.object({
            community_id: z.string(),
        }),
        output: z.string(),
        resolve: async ({ database, input, emit, events, user }) => {
            const isCommunityMember = await database.isCommunityMember({
                community_id: input.community_id,
            });

            if (!isCommunityMember) {
                throw new ApiError(403, "You must be a member of the community to listen to this channel.");
            }

            const onMessage: Events["unreadCommunityChannel"] = (community, channel, sender) => {
                if (community === input.community_id && sender !== user.id) {
                    emit(channel);
                }
            };

            events.on("unreadCommunityChannel", onMessage);

            return () => {
                events.off("unreadCommunityChannel", onMessage);
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
    reactToMessage: userVerifiedAction.handler({
        input: z.object({
            message_id: z.string(),
            emoji_id: z.string(),
        }),
        resolve: async ({ database, input, user }) => {
            const reaction = await database.transaction(async (tx) => {
                const isAllowed = await tx.isAllowedToReact({
                    message_id: input.message_id,
                });

                if (!isAllowed) {
                    throw new ApiError(403, "You must be a member of the community to react to this message.");
                }

                return await tx.reactToMessage({
                    message_id: input.message_id,
                    emoji_id: input.emoji_id,
                });
            });

            return reaction;
        },
    }),
    deleteReaction: userVerifiedAction.handler({
        input: z.object({
            message_id: z.string(),
            emoji_id: z.string(),
        }),
        resolve: async ({ database, input, user }) => {
            await database.deleteReaction({
                message_id: input.message_id,
                emoji_id: input.emoji_id,
            });
        },
    }),
};
