import { ChannelBanner } from "@/components/channels/channel-banner";
import { ChannelBody } from "@/components/channels/channel-body";

import { DEFAULT_ID } from "@/constants";
import { helpers } from "@/lib/api";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: { params: { channel: string } }) {
    await Promise.all([
        helpers.channels.getChannel.prefetch({
            input: {
                channel_id: params.channel,
            },
        }),
        helpers.channels.getMessageFromChannel.prefetchInfinite({
            input: {
                channel_id: params.channel,
            },
            initialPageParam: DEFAULT_ID,
        }),
    ]);
    return (
        <HydrationBoundary state={helpers.dehydrate()}>
            <ChannelBanner />
            <ChannelBody />
        </HydrationBoundary>
    );
}
