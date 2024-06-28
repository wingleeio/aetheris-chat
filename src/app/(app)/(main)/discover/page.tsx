import { helpers } from "@/lib/api";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function Page() {
    await helpers.communities.getCommunities.prefetch();
    return (
        <HydrationBoundary state={helpers.dehydrate()}>
            <div className="max-w-[600px]"></div>
        </HydrationBoundary>
    );
}
