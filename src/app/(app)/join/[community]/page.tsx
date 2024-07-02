import { CommunityJoinCard } from "@/components/communities/community-join-card";
import { HydrationBoundary } from "@tanstack/react-query";
import { helpers } from "@/lib/api";

export default async function Page({ params }: { params: { community: string } }) {
    await helpers.communities.getCommunity.prefetch({
        input: {
            id: params.community,
        },
    });

    return (
        <HydrationBoundary state={helpers.dehydrate()}>
            <div className="absolute inset-0 ">
                <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#424242_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>
            <CommunityJoinCard />
        </HydrationBoundary>
    );
}
