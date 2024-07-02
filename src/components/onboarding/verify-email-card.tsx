"use client";

import { ClientSignedIn } from "@/components/auth/client-signed-in";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RiArrowRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
    code: z
        .string()
        .min(8)
        .max(8)
        .refine((val) => /^\d+$/.test(val), {
            message: "Code can only contain numbers",
        }),
});
type Schema = z.infer<typeof schema>;

export function VerifyEmailCard() {
    const router = useRouter();
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            code: "",
        },
    });

    const verifyEmail = client.auth.verifyEmail.useMutation({
        onSuccess: () => {
            router.refresh();
        },
        onError: (error) => {
            toast.error("Error verifying email", {
                description: error.message,
            });
        },
    });

    const resendEmail = client.auth.resendVerificationEmail.useMutation({
        onSuccess: () => {
            toast.success("Verification email sent");
        },
        onError: (error) => {
            toast.error("Error sending verification email", {
                description: error.message,
            });
        },
    });

    const signOut = client.auth.signOut.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => verifyEmail.mutate(data);

    return (
        <ClientSignedIn>
            {(user) => (
                <Form {...form}>
                    <div className="relative bg-muted rounded-md shadow-lg border border-solid w-[380px] max-w-full">
                        <div className="rounded-md p-8 flex flex-col bg-background border-b border-solid">
                            <Link href="/">
                                <img className="h-8 mb-8" src="/logo.svg" alt="my logo" />
                            </Link>
                            <h1 className="font-semibold mb-2">Check your email</h1>
                            <p className="text-muted-foreground text-sm mb-8">
                                We've sent a code to <span className="font-semibold">{user.email}</span>! Enter your
                                verification code to continue.
                            </p>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="w-full mb-4 text-muted-foreground">
                                            <FormLabel className="whitespace-nowrap">Verification Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs opacity-80 font-normal" />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full gap-2" disabled={verifyEmail.isPending}>
                                    <span>Continue</span>
                                    {verifyEmail.isPending ? (
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
                        <div className="px-8 py-4 text-sm">
                            <span className="text-muted-foreground/80">
                                If you didn't receive a code or your code has expired,{" "}
                            </span>
                            <Link href="#" onClick={async () => resendEmail.mutate()}>
                                click here to resend your code.
                            </Link>
                        </div>
                    </div>
                </Form>
            )}
        </ClientSignedIn>
    );
}
