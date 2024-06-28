import { CreateProfileCard } from "@/app/create-profile-card";
import { VerifyEmailCard } from "@/app/verify-email-card";
import { WelcomeCard } from "@/app/welcome-card";
import { ServerSignedIn } from "@/components/auth/server-signed-in";
import { ServerSignedOut } from "@/components/auth/server-signed-out";
import { Fragment } from "react";

export default function Home() {
    return (
        <Fragment>
            <ServerSignedOut>
                <WelcomeCard />
            </ServerSignedOut>
            <ServerSignedIn condition={(user) => !user.email_verified}>
                <VerifyEmailCard />
            </ServerSignedIn>
            <ServerSignedIn condition={(user) => user.email_verified && !user.profile}>
                <CreateProfileCard />
            </ServerSignedIn>
            <ServerSignedIn condition={(user) => user.email_verified && !!user.profile}>
                <WelcomeCard />
            </ServerSignedIn>
        </Fragment>
    );
}
