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
        <div className="flex h-full bg-muted">
            <div className="flex flex-col p-2 ml-2 my-2 gap-2 bg-foreground/5 rounded-sm shadow-sm">
                <Link
                    href="/"
                    className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500"
                >
                    <FaHome />
                </Link>
                <Separator className="bg-foreground/5" />
                <div className="flex-grow relative">
                    <MyCommunities />
                </div>
                <Separator className="bg-foreground/5" />
                <CreateCommunityDialog>
                    <button className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500">
                        <FaPlusCircle />
                    </button>
                </CreateCommunityDialog>
                <Link
                    href="/discover"
                    className="w-12 h-12 rounded-sm text-muted-foreground text-2xl flex justify-center items-center hover:text-indigo-500"
                >
                    <FaCompass />
                </Link>
                <ModeToggle />
            </div>
            <div className="flex-grow">{children}</div>
        </div>
    );
}
