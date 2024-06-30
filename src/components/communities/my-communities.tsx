"use client";

import { client } from "@/lib/client";
import Link from "next/link";
import { Fragment } from "react";

export const MyCommunities = () => {
    const { data } = client.communities.getMyCommunities.useQuery();

    return (
        <Fragment>
            {data?.map((community) => (
                <Link
                    key={community.id}
                    href={`/community/${community.id}`}
                    className="w-full h-14 rounded-sm"
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
