import { ServerSignedIn } from "@/components/auth/server-signed-in";
import { ServerSignedOut } from "@/components/auth/server-signed-out";
import { CreateProfileCard } from "@/components/onboarding/create-profile-card";
import { VerifyEmailCard } from "@/components/onboarding/verify-email-card";
import { WelcomeCard } from "@/components/onboarding/welcome-card";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

const Background = () => {
    return (
        <div className="absolute inset-0 ">
            <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#424242_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
    );
};

export default async function IndexLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Fragment>
            <ServerSignedOut>
                <div className={cn("flex justify-center items-center flex-1 relative p-4")}>
                    <Background />
                    <WelcomeCard />
                </div>
            </ServerSignedOut>
            <ServerSignedIn condition={(user) => !user.email_verified}>
                <div className={cn("flex justify-center items-center flex-1 relative p-4")}>
                    <Background />
                    <VerifyEmailCard />
                </div>
            </ServerSignedIn>
            <ServerSignedIn condition={(user) => user.email_verified && !user.profile}>
                <div className={cn("flex justify-center items-center flex-1 relative p-4")}>
                    <Background />
                    <CreateProfileCard />
                </div>
            </ServerSignedIn>
            <ServerSignedIn condition={(user) => user.email_verified && !!user.profile}>
                <div className={cn("h-full w-full bg-muted")}>{children}</div>
            </ServerSignedIn>
        </Fragment>
    );
}
