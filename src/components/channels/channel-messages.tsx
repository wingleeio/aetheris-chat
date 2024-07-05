"use client";
import { Message } from "@/components/shared/message";
import { DEFAULT_ID } from "@/constants";
import { api, helpers } from "@/lib/api";
import { client, useAetherisContext } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { InView } from "react-intersection-observer";

export const ChannelMessages = () => {
    const { queryClient } = useAetherisContext();
    const params = useParams<{ channel: string; community: string }>();
    const channel = client.channels.getChannel.useQuery({
        input: {
            channel_id: params.channel,
        },
    });
    const messages = client.channels.getMessageFromChannel.useInfiniteQuery({
        input: {
            channel_id: params.channel,
        },
        getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.messages[0]?.id : undefined),
        initialPageParam: DEFAULT_ID,
    });

    if (!messages.data || !channel.data) {
        return null;
    }

    client.channels.listenToChannelMessages.useSubscription({
        input: {
            channel_id: params.channel,
        },
        onMessage: (message) => {
            queryClient.setQueryData(messages.queryKey, (data: typeof messages.data) => {
                data.pages[0].messages.push(message);
                return data;
            });
        },
    });

    useEffect(() => {
        const queryKeyChannels = helpers.channels.getChannels.getQueryKey({ community_id: params.community });
        const queryKeyCommunity = helpers.communities.getMyCommunities.getQueryKey();

        queryClient.setQueryData(queryKeyChannels, (data: Awaited<ReturnType<typeof api.channels.getChannels>>) => {
            return data
                ? data.map((channel) => {
                      if (channel.id === params.channel) {
                          return {
                              ...channel,
                              unread_count: 0,
                          };
                      }
                      return channel;
                  })
                : data;
        });

        const channels: Awaited<ReturnType<typeof api.channels.getChannels>> | undefined =
            queryClient.getQueryData(queryKeyChannels);
        const leftUnread = channels?.some((channel) => channel.unread_count > 0);

        if (!leftUnread) {
            queryClient.setQueryData(
                queryKeyCommunity,
                (data: Awaited<ReturnType<typeof api.communities.getMyCommunities>>) => {
                    return data
                        ? data.map((community) => {
                              if (community.id === params.community) {
                                  return {
                                      ...community,
                                      has_unread: false,
                                  };
                              }
                              return community;
                          })
                        : data;
                }
            );
        }
    }, []);

    return (
        <div className="flex-grow relative">
            <div className="absolute inset-0 overflow-auto flex flex-col-reverse">
                {messages.data.pages.map((page, i) => (
                    <div key={i} className={cn("flex-col-reverse", i === 0 && "pb-4")}>
                        {i === messages.data.pages.length - 1 && (
                            <InView
                                as="div"
                                onChange={(inView) => {
                                    if (
                                        inView &&
                                        messages.hasNextPage &&
                                        !messages.isFetching &&
                                        !messages.isFetchingNextPage
                                    ) {
                                        messages.fetchNextPage();
                                    }
                                }}
                            />
                        )}
                        {!page.has_more && (
                            <div className="text-muted-foreground">
                                <div className="font-semibold"># {channel.data.name}</div>
                                <div>This is the start of the conversation.</div>
                            </div>
                        )}
                        {page.messages.map((message, j) => {
                            let bundled = false;

                            if (j > 0) {
                                if (page.messages[j - 1].sender_id === message.sender_id) {
                                    const currentTime = new Date(message.created_at);
                                    const previousTime = new Date(page.messages[j - 1].created_at);
                                    const timeDifference = (currentTime.getTime() - previousTime.getTime()) / 1000;

                                    if (timeDifference <= 30) {
                                        bundled = true;
                                    }
                                }
                            }

                            return (
                                <div key={message.id} className={cn(!bundled && "pt-4")}>
                                    <Message message={message} bundled={bundled} />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
