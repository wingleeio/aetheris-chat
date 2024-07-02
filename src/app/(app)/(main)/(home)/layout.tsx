import { FaCompass, FaHome } from "react-icons/fa";

import { MyProfile } from "@/components/profile/my-profile";
import { Navigation } from "@/components/shared/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full p-2 flex gap-2 bg-muted">
            <div className="min-w-[300px] flex flex-col">
                <div className="flex-grow text-sm flex flex-col gap-1">
                    <Navigation
                        baseClassName="flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2 rounded-sm"
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
                <MyProfile />
            </div>
            <div className="p-4 bg-background rounded-sm shadow-sm flex-grow">{children}</div>
        </div>
    );
}
