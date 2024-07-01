"use client";

import { Fragment } from "react";
import Link from "next/link";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export const MyCommunities = () => {
    const params = useParams<{ community?: string }>();
    const { data } = client.communities.getMyCommunities.useQuery();
    if (!data) {
        return (
            <Fragment>
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
            </Fragment>
        );
    }
    return (
        <Fragment>
            {data.map((community) => (
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
