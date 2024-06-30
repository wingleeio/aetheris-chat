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
};
