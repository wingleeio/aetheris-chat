import { CommunityMessages } from "@/components/communities/community-messages";
import { CommunitySidebar } from "@/components/communities/community-sidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full p-2 overflow-hidden">
            <div className="h-full flex overflow-hidden bg-muted rounded-sm">
                <CommunitySidebar />
                <CommunityMessages>{children}</CommunityMessages>
            </div>
        </div>
    );
}
