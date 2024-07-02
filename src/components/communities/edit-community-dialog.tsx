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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string().min(1, "Required field"),
    about: z.string().min(1, "Required field"),
    icon: z.string().optional(),
    cover: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export const EditCommunityDialog = ({
    id,
    children,
    defaultValues,
}: {
    id: string;
    children: React.ReactNode;
    defaultValues: Schema;
}) => {
    const { queryClient } = useAetherisContext();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };

    const updateCommunity = client.communities.updateCommunity.useMutation({
        onSuccess: (community) => {
            setOpen(false);
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getMyCommunities.getQueryKey(),
            });
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getCommunity.getQueryKey({
                    id: community.id,
                }),
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
        updateCommunity.mutate({
            id,
            ...data,
        });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Community</DialogTitle>
                    <DialogDescription>Customize your community.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-[32px] relative text-sm">
                            <ImageUploadInput
                                name="cover"
                                defaultValue={defaultValues.cover}
                                className="bg-indigo-500 h-24 rounded-sm cursor-pointer group position relative"
                                setImageValue={form.setValue}
                                aspect={16 / 9}
                            >
                                <EditIcon className="h-4 w-4" />
                            </ImageUploadInput>
                            <ImageUploadInput
                                name="icon"
                                defaultValue={defaultValues.icon}
                                className="bg-indigo-500 h-[96px] w-[96px] rounded-full absolute bottom-[-20px] left-[8px] border-[3px] border-background"
                                setImageValue={form.setValue}
                            >
                                <EditIcon className="h-4 w-4 text-white" />
                            </ImageUploadInput>
                        </div>
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
                        <FormField
                            control={form.control}
                            name="about"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel className="whitespace-nowrap">About</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" className="w-full gap-2" disabled={updateCommunity.isPending}>
                                <span>Update community</span>
                                {updateCommunity.isPending ?? <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
