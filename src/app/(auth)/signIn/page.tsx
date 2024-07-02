"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FaDiscord, FaGithub } from "react-icons/fa";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { RiArrowRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import { client } from "@/lib/client";

const schema = z.object({
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    password: z
        .string()
        .regex(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*'), {
            message: "Password must contain at least one uppercase letter and one special character",
        })
        .min(8, {
            message: "Password must be at least 8 characters long",
        }),
});

type Schema = z.infer<typeof schema>;

export default function LoginPage() {
    const searchParams = useSearchParams();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signIn = client.auth.signIn.useMutation({
        onSuccess: () => {
            window.location.reload();
        },
        onError: (error) => {
            toast.error("Error signing in", {
                description: error.message,
            });
        },
    });

    const onSubmit = async (data: Schema) => signIn.mutate(data);

    return (
        <Form {...form}>
            <div className="relative bg-muted rounded-md shadow-lg border border-solid w-[380px] max-w-full transition-all">
                <div className="rounded-md p-8 flex flex-col bg-background border-b border-solid">
                    <Link href="/">
                        <img className="h-8 mb-8" src="/logo.svg" alt="my logo" />
                    </Link>
                    <h1 className="font-semibold mb-2">Sign in</h1>
                    <p className="text-muted-foreground text-sm mb-8">Welcome back! Please sign in to continue</p>
                    <div className="flex gap-2 w-full mb-4">
                        <Link href="/oauth/github" className="flex-1">
                            <Button variant="outline" className="w-full gap-4">
                                <FaGithub className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/oauth/discord" className="flex-1">
                            <Button variant="outline" className="w-full gap-4">
                                <FaDiscord className="h-5 w-5 fill-[#7289da]" />
                            </Button>
                        </Link>
                    </div>
                    <div className="mb-4 w-full flex items-center">
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-xs px-2">OR</span>
                        <Separator className="flex-1" />
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full mb-4 text-muted-foreground">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs opacity-80 font-normal" />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full gap-2" disabled={signIn.isPending}>
                            <span>Continue</span>
                            {signIn.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RiArrowRightLine />}
                        </Button>
                        {searchParams.get("error") === "oauth_error" && (
                            <Alert className="mt-8 text-white bg-red-500">
                                <AlertTitle className="text-sm font-semibold">Social Login Error</AlertTitle>
                                <AlertDescription>
                                    There was an error connection your social account. Please try again with a different
                                    account or login using email and password
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </div>
                <div className="px-8 py-4 text-sm">
                    <span className="text-muted-foreground/80">Don't have an account? </span>
                    <Link href="/signUp">Sign up now</Link>
                </div>
            </div>
        </Form>
    );
}
