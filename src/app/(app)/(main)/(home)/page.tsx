import { FaCompass, FaPlusCircle } from "react-icons/fa";

import { CreateCommunityDialog } from "@/components/communities/create-community-dialog";
import Link from "next/link";

export default function Page() {
    return (
        <div className="h-full flex items-center justify-center ">
            <div className="max-w-[600px] grid grid-cols-2 gap-4">
                <Link
                    href="/discover"
                    className="p-4 border border-muted rounded-sm cursor-pointer group flex gap-4 text-sm text-muted-foreground hover:shadow-sm"
                >
                    <div className="flex h-full items-center">
                        <FaCompass className="group-hover:text-indigo-500" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold group-hover:text-indigo-500">Discover communities</div>
                        <div>Find a community for your hobbies and interests.</div>
                    </div>
                </Link>
                <CreateCommunityDialog>
                    <button className="p-4 border border-muted rounded-sm cursor-pointer group flex gap-4 text-sm text-muted-foreground hover:shadow-sm">
                        <div className="flex h-full items-center">
                            <FaPlusCircle className="group-hover:text-indigo-500" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold group-hover:text-indigo-500">Create your community</div>
                            <div>Make a community and invite all your friends!</div>
                        </div>
                    </button>
                </CreateCommunityDialog>
            </div>
        </div>
    );
}
