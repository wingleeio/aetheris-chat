import { ChannelsList } from "@/components/channels/channels-list";
import { CommunityBanner } from "@/components/communities/community-banner";
import { MyProfile } from "@/components/profile/my-profile";

export default function Layout({
    children,
    params: { community },
}: Readonly<{
    children: React.ReactNode;
    params: { community: string };
}>) {
    return (
        <div className="h-full p-2 flex gap-2">
            <div className="min-w-[300px] flex flex-col">
                <div className="flex-grow text-sm flex flex-col gap-1">
                    <CommunityBanner id={community} />
                    <ChannelsList id={community} />
                </div>
                <MyProfile />
            </div>
            <div className="p-4 bg-background rounded-sm shadow-sm flex-grow">{children}</div>
        </div>
    );
}
