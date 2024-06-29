"use client";

import { FaUsers } from "react-icons/fa";
import { RiBarChart2Fill } from "react-icons/ri";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/client";

export const CommunitiesList = () => {
    const { data } = client.communities.getCommunities.useQuery({});

    if (!data) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            {data.map((community) => (
                <div
                    key={community.id}
                    className="rounded-sm overflow-hidden border border-muted text-sm text-muted-foreground col-span-1 cursor-pointer hover:shadow-sm"
                >
                    <div
                        style={{
                            backgroundImage: `url(${community.cover_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                        className="bg-indigo-500 h-24 position relative mb-[16px]"
                    >
                        <div
                            style={{
                                backgroundImage: `url(${community.icon_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            className="bg-indigo-500 h-[96px] w-[96px] rounded-full p-[3px] absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 border-[3px] border-background"
                        ></div>
                    </div>
                    <div className="p-4">
                        <div className="text-center font-semibold mb-4">{community.name}</div>
                        <div className="min-h-[100px]">{community.about}</div>
                        <div className="mt-6 flex justify-between">
                            <div className="text-muted-foreground flex gap-2 items-center text-xs">
                                <FaUsers />
                                <div>
                                    {community.member_count} member{community.member_count > 1 ? "s" : ""}
                                </div>
                            </div>
                            <div className="text-muted-foreground flex gap-2 items-center text-xs">
                                <RiBarChart2Fill />
                                <div>Low activity</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
