"use client";

import { client } from "@/lib/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Reply, X } from "lucide-react";
import Link from "next/link";

export const MessageReply = ({ id, content, sender_id }: { id: string; content: string; sender_id: string }) => {
    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: sender_id,
        },
    });

    if (!profile.data) return null;

    return (
        <Link className="bg-muted-foreground/10 p-3 rounded-md my-1 cursor-pointer block" href={"#" + id}>
            <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                <div>
                    <Reply className="h-[1em] w-[1em] scale-x-[-1]" />
                </div>
                <div>Reply to</div>
                <div>
                    <Avatar className=" h-[1.5em] w-[1.5em]">
                        <AvatarImage src={profile.data?.avatar_url ?? ""} />
                        <AvatarFallback>{profile.data?.display_name}</AvatarFallback>
                    </Avatar>
                </div>
                <div>{profile.data?.display_name}</div>
                <div className="flex-grow" />
            </div>
            <div
                className="prose leading-[20px] text-muted-foreground max-w-full break-words min-w-full"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </Link>
    );
};
