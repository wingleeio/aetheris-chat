import { userVerifiedAction } from "@/server/aether";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";

export const channels = {
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
};
