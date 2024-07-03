"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCog, FaDoorOpen } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { ClientSignedIn } from "@/components/auth/client-signed-in";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { api } from "@/lib/api";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";

const MyProfileWithQuery = ({ id }: { id: string }) => {
    const router = useRouter();
    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: id,
        },
    });

    if (!profile.data) return null;

    return (
        <div className="p-4 bg-background text-muted-foreground text-sm flex gap-2 shadow-sm">
            <div>
                <Avatar>
                    <AvatarImage src={profile.data.avatar_url ?? ""} />
                    <AvatarFallback>{profile.data.display_name}</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <div className="font-semibold">{profile.data.display_name}</div>
                <div className="text-xs">{profile.data.tag}</div>
            </div>
            <div className="flex-grow" />
            <EditProfileDialog id={id}>
                <Button variant="ghost" size="icon">
                    <FaCog />
                </Button>
            </EditProfileDialog>
            <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                    await api.auth.signOut();
                    router.refresh();
                }}
            >
                <FaDoorOpen />
            </Button>
        </div>
    );
};

export const MyProfile = () => {
    return <ClientSignedIn>{(user) => <MyProfileWithQuery id={user.id} />}</ClientSignedIn>;
};
