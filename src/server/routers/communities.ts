import { userRequiredAction, userVerifiedAction } from "@/server/aether";
import { ApiError } from "@/server/error";
import { z } from "zod";

export const communities = {
    createCommunity: userVerifiedAction.handler({
        input: z.object({
            name: z.string(),
            icon: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input, files }) => {
            const community = await database
                .createCommunity({
                    name: input.name,
                    icon_url: input.icon && (await files.upload("community-icon", input.icon)),
                    cover_url: input.cover && (await files.upload("community-cover", input.cover)),
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
};
