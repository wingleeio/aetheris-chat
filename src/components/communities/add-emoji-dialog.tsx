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
import { EditIcon, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { client, useAetherisContext } from "@/lib/client";

import { Button } from "@/components/ui/button";
import { ImageUploadInput } from "@/components/form/image-upload-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { helpers } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";

const schema = z.object({
    emoji: z.string().min(1, "Required field"),
    code: z
        .string()
        .min(1, "Required field")
        .regex(/^[A-Za-z0-9]+$/, "Only alphanumeric characters are allowed"),
});

type Schema = z.infer<typeof schema>;

export const AddEmojiDialog = ({ children }: { children: React.ReactNode }) => {
    const { queryClient } = useAetherisContext();
    const [open, setOpen] = useState(false);
    const params = useParams<{ community: string }>();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            emoji: "",
            code: "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };

    const addEmoji = client.communities.addEmoji.useMutation({
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getCommunity.getQueryKey({
                    id: params.community,
                }),
            });
            queryClient.invalidateQueries({
                queryKey: helpers.user.getMyEmojis.getQueryKey(),
            });
            form.reset();
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) =>
        addEmoji.mutate({
            community_id: params.community,
            ...data,
        });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Emoji</DialogTitle>
                    <DialogDescription>Customize your community.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-3 relative text-sm">
                            <ImageUploadInput
                                name="emoji"
                                className="bg-indigo-500 h-10 w-10 cursor-pointer group position relative"
                                setImageValue={form.setValue}
                            >
                                <EditIcon className="h-4 w-4" />
                            </ImageUploadInput>
                        </div>
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel className="whitespace-nowrap">Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" className="w-full gap-2" disabled={addEmoji.isPending}>
                                <span>Add Emoji</span>
                                {addEmoji.isPending ?? <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
