import { FaCompass, FaHome, FaPlusCircle } from "react-icons/fa";

import { CreateCommunityDialog } from "@/components/communities/create-community-dialog";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/theme-toggle";
import { MyCommunities } from "@/components/communities/my-communities";
import { Separator } from "@/components/ui/separator";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-full bg-foreground/5">
            <div className="flex flex-col py-2 gap-2">
                <div className="pl-4 pr-2">
                    <Link
                        href="/"
                        className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500"
                    >
                        <FaHome />
                    </Link>
                </div>
                <div className="pl-4 pr-2">
                    <Separator className="bg-foreground/5" />
                </div>
                <div className="flex-grow relative">
                    <MyCommunities />
                </div>
                <div className="pl-4 pr-2">
                    <Separator className="bg-foreground/5" />
                </div>
                <div className="pl-4 pr-2">
                    <CreateCommunityDialog>
                        <button className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500">
                            <FaPlusCircle />
                        </button>
                    </CreateCommunityDialog>
                </div>
                <div className="pl-4 pr-2">
                    <Link
                        href="/discover"
                        className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500"
                    >
                        <FaCompass />
                    </Link>
                </div>
                <div className="pl-4 pr-2">
                    <ModeToggle />
                </div>
            </div>
            <div className="flex-grow">{children}</div>
        </div>
    );
}
