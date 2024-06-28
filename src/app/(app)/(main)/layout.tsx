import { ServerSignedIn } from "@/components/auth/server-signed-in";
import { Navigation } from "@/components/shared/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaHome, FaCompass } from "react-icons/fa";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full p-2 grid grid-cols-10 gap-2">
            <div className="col-span-2 flex flex-col">
                <div className="flex-grow text-sm flex flex-col gap-1">
                    <Navigation
                        baseClassName="flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2"
                        activeClassName="bg-background"
                        items={[
                            {
                                icon: <FaHome />,
                                name: "Home",
                                href: "/",
                            },
                            {
                                icon: <FaCompass />,
                                name: "Discover",
                                href: "/discover",
                            },
                        ]}
                    />
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
            <div className="h-full flex items-center justify-center bg-background rounded-sm shadow-sm col-span-8">
                {children}
            </div>
        </div>
    );
}
