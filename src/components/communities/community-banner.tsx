"use client";

import { client } from "@/lib/client";

export const CommunityBanner = ({ id }: { id: string }) => {
    const { data } = client.communities.getCommunity.useQuery({
        input: {
            id,
        },
    });

    return (
        <div
            style={{
                backgroundImage: `url(${data?.cover_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            className="rounded-sm relative overflow-hidden mb-2"
        >
            <div className="p-2 text-white h-28 flex flex-col z-10 relative">
                <div className="flex-grow" />
                <div>{data?.name}</div>
            </div>
            <div className="bg-gradient-to-t from-black/70 to-white/0 absolute inset-0"></div>
        </div>
    );
};
