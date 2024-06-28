"use client";

import { ImageUploadInput } from "@/components/form/image-upload-input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1, "Required field"),
    about: z.string().min(1, "Required field"),
    icon: z.string().optional(),
    cover: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export const CreateCommunityDialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            icon: "",
            cover: "",
            about: "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };

    const createCommunity = client.communities.createCommunity.useMutation({
        onSuccess: () => {
            router.refresh();
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => createCommunity.mutate(data);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Community</DialogTitle>
                    <DialogDescription>Fill in a few details to finish setting up your community.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-[32px] relative text-sm">
                            <ImageUploadInput
                                name="cover"
                                className="bg-indigo-500 h-24 rounded-sm cursor-pointer group position relative"
                                setImageValue={form.setValue}
                            >
                                <EditIcon className="h-4 w-4" />
                            </ImageUploadInput>
                            <ImageUploadInput
                                name="icon"
                                className="bg-indigo-500 h-[96px] w-[96px] rounded-full p-[3px] absolute bottom-[-20px] left-[8px] border-[3px] border-background"
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
                            <Button type="submit" className="w-full gap-2" disabled={createCommunity.isPending}>
                                <span>Create community</span>
                                {createCommunity.isPending ?? <Loader2 className="h-4 w-4 animate-spin" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
