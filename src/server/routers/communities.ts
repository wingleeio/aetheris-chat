import { Events } from "@/lib/events";
import { userRequiredAction, userVerifiedAction } from "@/server/aether";

import { ApiError } from "@/server/error";
import { z } from "zod";
import sharp from "sharp";

export const communities = {
    createCommunity: userVerifiedAction.handler({
        input: z.object({
            name: z.string(),
            about: z.string(),
            icon: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input, files }) => {
            const community = await database
                .transaction(async (tx) => {
                    const community = await tx.createCommunity({
                        name: input.name,
                        about: input.about,
                        icon_url: input.icon && (await files.upload("community-icon", input.icon)),
                        cover_url: input.cover && (await files.upload("community-cover", input.cover)),
                    });

                    await tx.createChannel({
                        name: "general",
                        community_id: community.id,
                    });

                    return community;
                })
                .catch(() => {
                    throw new ApiError(500, "Failed to create community");
                });

            return {
                id: community.id,
            };
        },
    }),
    updateCommunity: userVerifiedAction.handler({
        input: z.object({
            id: z.string(),
            name: z.string(),
            about: z.string(),
            icon: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input, files }) => {
            const community = await database.transaction(async (tx) => {
                const isAllowed = await tx.isAllowedToUpdateCommunity({
                    community_id: input.id,
                });

                if (!isAllowed) {
                    throw new ApiError(404, "User is not allowed to update this community.");
                }

                const community = await tx
                    .updateCommunity({
                        community_id: input.id,
                        name: input.name,
                        about: input.about,
                        icon_url:
                            input.icon && !input.icon.startsWith("http")
                                ? await files.upload("community-icon", input.icon)
                                : undefined,
                        cover_url:
                            input.cover && !input.cover.startsWith("http")
                                ? await files.upload("community-cover", input.cover)
                                : undefined,
                    })
                    .then((community) => {
                        if (!community) {
                            throw new ApiError(404, "Community not found");
                        }
                        return community;
                    })
                    .catch(() => {
                        throw new ApiError(500, "Failed to create community");
                    });

                return community;
            });

            return {
                id: community.id,
            };
        },
    }),
    getMyCommunities: userRequiredAction.handler({
        resolve: async ({ database }) => {
            return database.getMyCommunities();
        },
    }),
    getCommunities: userRequiredAction.handler({
        resolve: async ({ database }) => {
            return database.getCommunities();
        },
    }),
    getCommunity: userRequiredAction.handler({
        input: z.object({
            id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            return database.getCommunity({
                community_id: input.id,
            });
        },
    }),
    joinCommunity: userVerifiedAction.handler({
        input: z.object({
            id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            await database.joinCommunity({
                community_id: input.id,
            });
        },
    }),
    leaveCommunity: userVerifiedAction.handler({
        input: z.object({
            id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            await database.leaveCommunity({
                community_id: input.id,
            });
        },
    }),
    listenForUnreadCommunities: userVerifiedAction.subscription({
        output: z.object({
            community_id: z.string(),
            channel_id: z.string(),
        }),
        resolve: async ({ database, emit, events, user }) => {
            const onMessage: Events["unreadCommunity"] = async (community, channel, sender) => {
                if (user.id === sender) return;
                const isCommunityMember = await database.isCommunityMember({
                    community_id: community,
                });

                if (isCommunityMember) {
                    emit({
                        community_id: community,
                        channel_id: channel,
                    });
                }
            };

            events.on("unreadCommunity", onMessage);

            return () => {
                events.off("unreadCommunity", onMessage);
            };
        },
    }),
    addEmoji: userVerifiedAction.handler({
        input: z.object({
            community_id: z.string(),
            emoji: z.string(),
            code: z.string().regex(/^[A-Za-z0-9]+$/, "Only alphanumeric characters are allowed"),
        }),
        resolve: async ({ database, input, files }) => {
            await database.transaction(async (tx) => {
                const isAllowed = await tx.isAllowedToUpdateCommunity({
                    community_id: input.community_id,
                });

                if (!isAllowed) {
                    throw new ApiError(404, "User is not allowed to update this community.");
                }

                const codeExists = await tx.doesEmojiCodeAlreadyExist({
                    community_id: input.community_id,
                    code: input.code,
                });

                if (codeExists) {
                    throw new ApiError(422, "Emoji with this code already exists in this community.");
                }

                const emoji_url = await files.upload("emoji", input.emoji, (buffer) => {
                    return sharp(buffer).resize(120, 120).png().toBuffer();
                });

                await tx.addEmoji({
                    community_id: input.community_id,
                    code: input.code,
                    emoji_url,
                });
            });
        },
    }),
    deleteEmoji: userVerifiedAction.handler({
        input: z.object({
            emoji_id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            await database.transaction(async (tx) => {
                const emoji = await tx.getEmoji({
                    emoji_id: input.emoji_id,
                });

                if (!emoji) {
                    throw new ApiError(404, "Emoji not found.");
                }

                const isAllowed = await tx.isAllowedToUpdateCommunity({
                    community_id: emoji.community.id,
                });

                if (!isAllowed) {
                    throw new ApiError(404, "User is not allowed to update this community.");
                }

                await tx.deleteEmoji({
                    emoji_id: input.emoji_id,
                });
            });
        },
    }),
};
