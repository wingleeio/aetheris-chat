"use client";

import { Form, FormField } from "@/components/ui/form";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export const ChannelMessageInput = () => {
    const params = useParams<{ channel: string }>();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: "",
        },
    });

    const sendMessage = client.channels.sendMessageToChannel.useMutation({
        onSuccess: () => {
            form.reset();
        },
        onError: (error) => {
            toast.error("Error sending message", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) =>
        sendMessage.mutate({
            ...data,
            channel_id: params.channel,
        });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <div>
                            <input
                                className="w-full p-4 outline-none focus:outline-none text-muted-foreground bg-muted rounded-sm"
                                placeholder="Enter your message here..."
                                {...field}
                            />
                        </div>
                    )}
                />
            </form>
        </Form>
    );
};
