"use client";

import { ClientSignedIn } from "@/components/auth/client-signed-in";
import { ClientSignedOut } from "@/components/auth/client-signed-out";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const TestComponent = () => {
    const router = useRouter();
    return (
        <div className="p-4 flex flex-col gap-4">
            <h1>Hello, world!</h1>
            <p>
                <ClientSignedIn>
                    {(user) => (
                        <>
                            Welcome, {user.id}!
                            {!user.email_verified && (
                                <>
                                    <br />
                                    Your email is not verified.{" "}
                                    <Link href="/verify">Click here to enter your verification code.</Link>
                                </>
                            )}
                        </>
                    )}
                </ClientSignedIn>
                <ClientSignedOut>You are not logged in!</ClientSignedOut>
            </p>
            <div className="flex gap-4">
                <ClientSignedIn>
                    <Button
                        onClick={async () => {
                            await api.auth.signOut();
                            router.refresh();
                        }}
                    >
                        Logout
                    </Button>
                </ClientSignedIn>
                <ClientSignedOut>
                    <Link href="/signIn">
                        <Button>Sign In</Button>
                    </Link>
                    <Link href="/signUp">
                        <Button>Join</Button>
                    </Link>
                </ClientSignedOut>
            </div>
        </div>
    );
};
