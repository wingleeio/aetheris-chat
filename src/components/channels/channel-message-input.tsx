"use client";

import { TipTap } from "@/components/shared/tip-tap";
import { Form, FormField } from "@/components/ui/form";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiItem } from "@tiptap-pro/extension-emoji";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const ChannelMessageInput = () => {
    const params = useParams<{ channel: string }>();
    const channel = client.channels.getChannel.useQuery({
        input: {
            channel_id: params.channel,
        },
    });
    const { data } = client.user.getMyEmojis.useQuery();

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
        sendMessage.mutate({
            ...data,
            channel_id: params.channel,
        });
    };

    const emojis = useMemo(() => {
        if (!data) return [];

        const emojis: EmojiItem[] = [];

        data.forEach((community) => {
            community.emojis.forEach((emoji) => {
                emojis.push({
                    name: emoji.id,
                    shortcodes: [emoji.code],
                    tags: [emoji.code],
                    group: community.id,
                    fallbackImage: emoji.emoji_url,
                });
            });
        });

        return emojis;
    }, [data]);

    if (!data) return null;

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
                            emojis={emojis}
                        />
                    )}
                />
            </form>
        </Form>
    );
};
