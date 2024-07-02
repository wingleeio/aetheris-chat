"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api, helpers } from "@/lib/api";
import { client, useAetherisContext } from "@/lib/client";

import { Button } from "@/components/ui/button";
import { ImageUploadInput } from "@/components/form/image-upload-input";
import { Input } from "@/components/ui/input";
import { RiArrowRightLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    display_name: z.string().min(1, "Required field"),
    tag: z.string().regex(new RegExp("^#[A-Za-z0-9]+$"), "Must be in this format: #tag").min(1, ""),
    avatar: z.string().optional(),
    cover: z.string().optional(),
    bio: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

const EditProfile = ({
    id,
    children,
    profile,
}: {
    id: string;
    children: React.ReactNode;
    profile: NonNullable<Awaited<ReturnType<typeof api.user.getProfile>>>;
}) => {
    const [open, setOpen] = useState(false);
    const { queryClient } = useAetherisContext();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            display_name: profile.display_name,
            tag: profile.tag,
            avatar: profile.avatar_url ?? "",
            cover: profile.cover_url ?? "",
            bio: profile.bio ?? "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setOpen(open);
    };

    const updateProfile = client.user.updateProfile.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: helpers.user.getProfile.getQueryKey({ user_id: id }),
            });
            setOpen(false);
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => updateProfile.mutate(data);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>Customize your profile and express who you are</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-[32px] relative text-sm">
                            <ImageUploadInput
                                defaultValue={profile.cover_url ?? ""}
                                name="cover"
                                className="bg-indigo-500 h-24 rounded-sm cursor-pointer group position relative"
                                setImageValue={form.setValue}
                                aspect={16 / 9}
                            >
                                <EditIcon className="h-4 w-4" />
                            </ImageUploadInput>
                            <ImageUploadInput
                                defaultValue={profile.avatar_url ?? ""}
                                name="avatar"
                                className="bg-indigo-500 h-[96px] w-[96px] rounded-full p-[3px] absolute bottom-[-20px] left-[8px] border-[3px] border-background"
                                setImageValue={form.setValue}
                            >
                                <EditIcon className="h-4 w-4 text-white" />
                            </ImageUploadInput>
                        </div>
                        <div className="grid grid-cols-[3fr_1fr] gap-4">
                            <FormField
                                control={form.control}
                                name="display_name"
                                render={({ field }) => (
                                    <FormItem className="w-full mb-4 text-muted-foreground">
                                        <FormLabel className="whitespace-nowrap">Display Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs opacity-80 font-normal" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tag"
                                render={({ field }) => (
                                    <FormItem className="w-full mb-4 text-muted-foreground">
                                        <FormLabel className="whitespace-nowrap">Tag</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs opacity-80 font-normal" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel className="whitespace-nowrap">Biography</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full gap-2" disabled={updateProfile.isPending}>
                            <span>Update Profile</span>
                            {updateProfile.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RiArrowRightLine />
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export const EditProfileDialog = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: id,
        },
    });

    if (!profile.data) return null;

    return (
        <EditProfile id={id} profile={profile.data}>
            {children}
        </EditProfile>
    );
};
