import { ApiError } from "@/server/error";
import { userVerifiedAction } from "@/server/aether";
import { z } from "zod";

export const user = {
    getProfile: userVerifiedAction.handler({
        input: z.object({
            user_id: z.string(),
        }),
        resolve: async ({ database, input }) => {
            return database.getProfile({
                user_id: input.user_id,
            });
        },
    }),
    createProfile: userVerifiedAction.handler({
        input: z.object({
            display_name: z.string(),
            tag: z.string(),
            bio: z.string().optional(),
            avatar: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input, files }) => {
            await database
                .createProfile({
                    display_name: input.display_name,
                    tag: input.tag,
                    bio: input.bio,
                    avatar_url: input.avatar && (await files.upload("user-avatar", input.avatar)),
                    cover_url: input.cover && (await files.upload("user-cover", input.cover)),
                })
                .catch(() => {
                    throw new ApiError(500, "Failed to create profile");
                });
        },
    }),
    updateProfile: userVerifiedAction.handler({
        input: z.object({
            display_name: z.string().optional(),
            tag: z.string().optional(),
            bio: z.string().optional(),
            avatar: z.string().optional(),
            cover: z.string().optional(),
        }),
        resolve: async ({ database, input, files }) => {
            await database
                .updateProfile({
                    display_name: input.display_name,
                    tag: input.tag,
                    bio: input.bio,
                    avatar_url:
                        input.avatar && !input.avatar.startsWith("http")
                            ? await files.upload("user-avatar", input.avatar)
                            : undefined,
                    cover_url:
                        input.cover && !input.cover.startsWith("http")
                            ? await files.upload("user-cover", input.cover)
                            : undefined,
                })
                .catch(() => {
                    throw new ApiError(500, "Failed to update profile");
                });
        },
    }),
    getMyEmojis: userVerifiedAction.handler({
        resolve: async ({ database }) => {
            return database.getAllEmojis();
        },
    }),
};
