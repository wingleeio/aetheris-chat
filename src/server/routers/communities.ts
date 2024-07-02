import { userRequiredAction, userVerifiedAction } from "@/server/aether";

import { ApiError } from "@/server/error";
import { z } from "zod";

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
};
