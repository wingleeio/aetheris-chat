import { ChannelBanner } from "@/components/channels/channel-banner";
import { ChannelMessageInput } from "@/components/channels/channel-message-input";
import { ChannelMessages } from "@/components/channels/channel-messages";
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
            <div className="px-4 pb-4 flex flex-col flex-grow">
                <ChannelMessages />
                <ChannelMessageInput />
            </div>
        </HydrationBoundary>
    );
}
