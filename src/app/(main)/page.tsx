"use client";

import { ClientSignedIn } from "@/components/auth/client-signed-in";
import { CreateCommunityDialog } from "@/components/communities/create-community-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHome, FaCompass, FaPlusCircle, FaList } from "react-icons/fa";

export default function Page() {
    return (
        <ClientSignedIn>
            {(user) => (
                <div className="h-full p-2 grid grid-cols-10 gap-2">
                    <div className="col-span-2 flex flex-col">
                        <div className="flex-grow text-sm flex flex-col gap-1">
                            <div className="flex gap-4 items-center text-muted-foreground cursor-pointer bg-background transition-all px-4 py-2">
                                <FaHome /> Home
                            </div>
                            <div className="flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2">
                                <FaList /> My Communities
                            </div>
                            <div className="flex gap-4 items-center text-muted-foreground cursor-pointer hover:bg-background transition-all px-4 py-2">
                                <FaCompass /> Discover
                            </div>
                        </div>
                        <div className="p-4 bg-background rounded-sm text-muted-foreground text-sm flex gap-2 shadow-sm">
                            <div>
                                <Avatar>
                                    <AvatarImage src={user.profile?.avatar_url ?? ""} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <div className="font-semibold">{user.profile?.display_name}</div>
                                <div className="text-xs">{user.profile?.tag}</div>
                            </div>
                        </div>
                    </div>
                    <div className="h-full flex items-center justify-center bg-background rounded-sm shadow-sm col-span-8">
                        <div className="max-w-[600px]">
                            <div className="grid grid-cols-2 gap-4">
                                <a className="p-4 border border-muted rounded-sm cursor-pointer group flex gap-4 text-sm text-muted-foreground hover:shadow-sm">
                                    <div className="flex h-full items-center">
                                        <FaCompass className="group-hover:text-indigo-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold group-hover:text-indigo-500">
                                            Discover communities
                                        </div>
                                        <div>Find a community for your hobbies and interests.</div>
                                    </div>
                                </a>
                                <CreateCommunityDialog>
                                    <button className="p-4 border border-muted rounded-sm cursor-pointer group flex gap-4 text-sm text-muted-foreground hover:shadow-sm">
                                        <div className="flex h-full items-center">
                                            <FaPlusCircle className="group-hover:text-indigo-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold group-hover:text-indigo-500">
                                                Create your community
                                            </div>
                                            <div>Make a community and invite all your friends!</div>
                                        </div>
                                    </button>
                                </CreateCommunityDialog>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ClientSignedIn>
    );
}
