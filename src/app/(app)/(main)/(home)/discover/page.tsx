import { CommunitiesList } from "@/components/communities/communities-list";
import { HydrationBoundary } from "@tanstack/react-query";
import { helpers } from "@/lib/api";

export default async function Page() {
    await helpers.communities.getCommunities.prefetch();
    return (
        <HydrationBoundary state={helpers.dehydrate()}>
            <div className="w-full relative h-full">
                <div className="absolute inset-0 overflow-auto">
                    <CommunitiesList />
                </div>
            </div>
        </HydrationBoundary>
    );
}
