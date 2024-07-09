"use client";

import { TipTap } from "@/components/shared/tip-tap";
import { Form, FormField } from "@/components/ui/form";
import { DEFAULT_ID } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { client, useAetherisContext } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply, X } from "lucide-react";
import { ChannelContext } from "@/components/channels/channel-context";
import { useContext, useRef } from "react";

const schema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const ChannelMessageInput = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { replyingTo, setReplyingTo } = useContext(ChannelContext);
    const { queryClient } = useAetherisContext();
    const session = useAuth();
    const params = useParams<{ channel: string }>();
    const messages = client.channels.getMessageFromChannel.useInfiniteQuery({
        input: {
            channel_id: params.channel,
        },
        getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.messages[0]?.id : undefined),
        initialPageParam: DEFAULT_ID,
    });

    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: replyingTo?.sender_id ?? DEFAULT_ID,
        },
        enabled: !!replyingTo,
    });

    const channel = client.channels.getChannel.useQuery({
        input: {
            channel_id: params.channel,
        },
    });

    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: "",
        },
    });

    const sendMessage = client.channels.sendMessageToChannel.useMutation({
        onError: (error) => {
            toast.error("Error sending message", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        form.reset();
        const temp_id = v4() + "-temp";
        queryClient.setQueryData(messages.queryKey, (cache: any) => {
            cache.pages[0].messages.push({
                id: temp_id,
                sender_id: session.user!.id,
                created_at: new Date().toISOString(),
                content: data.content,
                reply_to: replyingTo && {
                    id: replyingTo.id,
                    sender_id: replyingTo.sender_id,
                    content: replyingTo.content,
                },
            });
            return cache;
        });
        sendMessage.mutate({
            ...data,
            temp_id,
            channel_id: params.channel,
            message_id: replyingTo?.id,
        });
        setReplyingTo(null);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative overflow-x-hidden">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <div className="rounded-[30px] w-full p-4 bg-muted">
                            {!!replyingTo && (
                                <div className="text-muted-foreground text-xs mb-3 flex items-center gap-1">
                                    <div>
                                        <Reply className="h-[1em] w-[1em] scale-x-[-1]" />
                                    </div>
                                    <div>Replying to</div>
                                    <div>
                                        <Avatar className=" h-[1.5em] w-[1.5em]">
                                            <AvatarImage src={profile.data?.avatar_url ?? ""} />
                                            <AvatarFallback>{profile.data?.display_name}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>{profile.data?.display_name}</div>
                                    <div className="flex-grow" />
                                    <div>
                                        <button
                                            type="button"
                                            className="text-xs text-muted-foreground hover:text-primary flex items-center"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            <X className="h-[1em] w-[1em]" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <TipTap
                                className="p-1 outline-none focus:outline-none text-muted-foreground"
                                placeholder={`Message #${channel.data?.name}`}
                                onSubmit={() => {
                                    if (buttonRef.current) {
                                        buttonRef.current.click();
                                    }
                                }}
                                onChange={field.onChange}
                                value={field.value}
                            />
                        </div>
                    )}
                />
                <button type="submit" className="hidden" ref={buttonRef} />
            </form>
        </Form>
    );
};
