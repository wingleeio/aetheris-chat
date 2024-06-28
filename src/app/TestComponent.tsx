"use client";

import { ClientSignedIn } from "@/components/auth/client-signed-in";
import { ClientSignedOut } from "@/components/auth/client-signed-out";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const TestComponent = () => {
    const router = useRouter();

    const signOut = client.auth.signOut.useMutation({
        onSuccess: () => {
            router.refresh();
        },
    });

    return (
        <div className="p-4 flex flex-col gap-4 relative">
            <Card className="relative rounded-md shadow-lg border border-solid w-[380px] max-w-full p-3">
                <CardHeader>
                    <Link href="/">
                        <img className="h-8 mb-8" src="/logo.svg" alt="my logo" />
                    </Link>
                    <CardTitle>Aetheris</CardTitle>
                    <CardDescription>Find your community</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    Aetheris chat is a demo chat application made using{" "}
                    <Link className="text-indigo-500 hover:underline" href="https://docs.aetheris.io">
                        Aetheris
                    </Link>{" "}
                    and{" "}
                    <Link className="text-indigo-500 hover:underline" href="https://nextjs.org">
                        Next.js
                    </Link>
                    , showcasing many of the features available in the Aetheris framework.
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <ClientSignedOut>
                        <Link className="w-full" href="/signIn">
                            <Button className="w-full">Sign in</Button>
                        </Link>
                        <Link className="w-full" href="/signUp">
                            <Button className="w-full" variant="outline">
                                Join now
                            </Button>
                        </Link>
                    </ClientSignedOut>
                    <ClientSignedIn>
                        <Button className="w-full" onClick={() => signOut.mutate()}>
                            Sign out
                        </Button>
                    </ClientSignedIn>
                </CardFooter>
            </Card>
        </div>
    );
};
