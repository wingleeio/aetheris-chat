"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { client, useAetherisContext } from "@/lib/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { helpers } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string().min(1, "Required field"),
});

type Schema = z.infer<typeof schema>;

export const AddChannelDialog = ({ id, children }: { children: React.ReactNode; id: string }) => {
    const { queryClient } = useAetherisContext();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };

    const createChannel = client.channels.createChannel.useMutation({
        onSuccess: (channel) => {
            setOpen(false);
            queryClient.invalidateQueries({
                queryKey: helpers.channels.getChannels.getQueryKey({
                    community_id: id,
                }),
            });
            router.push("/community/" + id + "/channel/" + channel.id);
            form.reset();
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) =>
        createChannel.mutate({
            community_id: id,
            ...data,
        });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add channel</DialogTitle>
                    <DialogDescription>Fill in a few details to finish setting up your channel.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel className="whitespace-nowrap">Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="w-full gap-2" disabled={createChannel.isPending}>
                                <span>Create channel</span>
                                {createChannel.isPending ?? <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
