"use client";

import { ImageUploadInput } from "@/components/form/image-upload-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RiArrowRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    display_name: z.string().min(1, "Required field"),
    tag: z.string().regex(new RegExp("^#[A-Za-z0-9]+$"), "Must be in this format: #tag").min(1, ""),
    avatar: z.string().optional(),
    cover: z.string().optional(),
    bio: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export function CreateProfileCard() {
    const router = useRouter();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            display_name: "",
            tag: "#0001",
            avatar: "",
            cover: "",
            bio: "",
        },
    });

    const createProfile = client.user.createProfile.useMutation({
        onSuccess: () => {
            router.refresh();
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
        },
    });

    const signOut = client.auth.signOut.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => createProfile.mutate(data);

    return (
        <Form {...form}>
            <div className="relative bg-muted rounded-md shadow-lg border border-solid w-[380px] max-w-full">
                <div className="rounded-md p-8 flex flex-col bg-background border-b border-solid">
                    <Link href="/">
                        <img className="h-8 mb-8" src="/logo.svg" alt="my logo" />
                    </Link>
                    <h1 className="font-semibold mb-2">Create your profile</h1>
                    <p className="text-muted-foreground text-sm mb-8">
                        Finish setting up your profile to start chatting with others.
                    </p>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="mb-[32px] relative text-sm">
                            <ImageUploadInput
                                name="cover"
                                className="bg-indigo-500 h-24 rounded-sm cursor-pointer group position relative"
                                setImageValue={form.setValue}
                                aspect={16 / 9}
                            >
                                <EditIcon className="h-4 w-4" />
                            </ImageUploadInput>
                            <ImageUploadInput
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
                        <Button type="submit" className="w-full gap-2" disabled={createProfile.isPending}>
                            <span>Continue</span>
                            {createProfile.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RiArrowRightLine />
                            )}
                        </Button>
                        <Button variant="outline" className="w-full mt-2" onClick={() => signOut.mutate()}>
                            Sign out
                        </Button>
                    </form>
                </div>
            </div>
        </Form>
    );
}
