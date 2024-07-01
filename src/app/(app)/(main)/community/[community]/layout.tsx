import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChannelsList } from "@/components/channels/channels-list";
import { CommunityBanner } from "@/components/communities/community-banner";
import { ServerSignedIn } from "@/components/auth/server-signed-in";

export default function Layout({
    children,
    params: { community },
}: Readonly<{
    children: React.ReactNode;
    params: { community: string };
}>) {
    return (
        <div className="h-full p-2 grid grid-cols-10 gap-2">
            <div className="col-span-2 flex flex-col">
                <div className="flex-grow text-sm flex flex-col gap-1">
                    <CommunityBanner id={community} />
                    <ChannelsList id={community} />
                </div>
                <ServerSignedIn>
                    {(user) => (
                        <div className="p-4 bg-background rounded-sm text-muted-foreground text-sm flex gap-2 shadow-sm">
                            <div>
                                <Avatar>
                                    <AvatarImage src={user.profile?.avatar_url ?? ""} />
                                    <AvatarFallback>{user.profile?.display_name}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <div className="font-semibold">{user.profile?.display_name}</div>
                                <div className="text-xs">{user.profile?.tag}</div>
                            </div>
                        </div>
                    )}
                </ServerSignedIn>
            </div>
            <div className="p-4 bg-background rounded-sm shadow-sm col-span-8">{children}</div>
        </div>
    );
}
