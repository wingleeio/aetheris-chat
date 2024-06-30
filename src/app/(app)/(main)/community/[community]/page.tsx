import { helpers } from "@/lib/api";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: { params: { id: string } }) {
    await Promise.all([
        helpers.communities.getCommunity.prefetch({
            input: {
                id: params.id,
            },
        }),
        helpers.channels.getChannels.prefetch({
            input: {
                community_id: params.id,
            },
        }),
    ]);

    return <HydrationBoundary state={helpers.dehydrate()}></HydrationBoundary>;
}
