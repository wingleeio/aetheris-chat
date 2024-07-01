"use client";

import { Fragment } from "react";
import Link from "next/link";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export const MyCommunities = () => {
    const params = useParams<{ community?: string }>();
    const { data } = client.communities.getMyCommunities.useQuery();

    return (
        <Fragment>
            {data?.map((community) => (
                <Link
                    key={community.id}
                    href={`/community/${community.id}`}
                    className={cn(
                        "w-12 h-12 transition-all",
                        params.community === community.id && "rounded-lg",
                        params.community !== community.id && "rounded-3xl hover:rounded-xl"
                    )}
                    style={{
                        backgroundImage: `url(${community.icon_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            ))}
        </Fragment>
    );
};
