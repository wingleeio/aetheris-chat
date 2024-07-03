"use client";

import { FaCompass, FaHome } from "react-icons/fa";
import { MyProfile } from "@/components/profile/my-profile";
import { Navigation } from "@/components/shared/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const HomeSidebar = () => {
    const pathname = usePathname();
    const notRoot = pathname !== "/";

    return (
        <div
            className={cn(
                "min-w-full sm:min-w-[300px] flex flex-col overflow-hidden transition-all",
                notRoot && "min-w-[0px] w-0 md:min-w-[300px] md:w-auto",
            )}
        >
            <div className="flex-grow text-sm flex flex-col">
                <Navigation
                    baseClassName="flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2"
                    activeClassName="bg-background"
                    items={[
                        {
                            icon: <FaHome />,
                            name: "Home",
                            href: "/home",
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
    );
};
