import { userRequiredAction, userVerifiedAction } from "@/server/aether";
import { z } from "zod";

export const communities = {
    createCommunity: userVerifiedAction.handler({
        input: z.object({
            name: z.string(),
            icon: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input }) => {
            const community = await database.createCommunity(input);
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
