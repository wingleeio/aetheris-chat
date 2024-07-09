"use client";

import { TipTap } from "@/components/shared/tip-tap";
import { Form, FormField } from "@/components/ui/form";
import { DEFAULT_ID } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { helpers } from "@/lib/api";
import { client, useAetherisContext } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";

const schema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const ChannelMessageInput = () => {
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
            });
            return cache;
        });
        sendMessage.mutate({
            ...data,
            temp_id,
            channel_id: params.channel,
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative overflow-x-hidden">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <TipTap
                            className="w-full p-4 outline-none focus:outline-none text-muted-foreground bg-muted rounded-sm"
                            placeholder={`Message #${channel.data?.name}`}
                            onSubmit={form.handleSubmit(onSubmit)}
                            onChange={field.onChange}
                            value={field.value}
                        />
                    )}
                />
            </form>
        </Form>
    );
};
