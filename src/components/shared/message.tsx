import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ProfileHoverCard } from "@/components/profile/profile-hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Reply, Smile } from "lucide-react";
import { MessageReactPopover } from "@/components/shared/message-react-popover";
import { ChannelContext } from "@/components/channels/channel-context";
import { useContext } from "react";
import { MessageReply } from "@/components/shared/message-reply";

export const Message = ({
    message,
    bundled = false,
}: {
    message: Awaited<ReturnType<typeof api.channels.getMessageFromChannel>>["messages"][0];
    bundled?: boolean;
}) => {
    const { replyingTo, setReplyingTo } = useContext(ChannelContext);
    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: message.sender_id,
        },
    });

    const isTemp = message.id.includes("-temp");

    return (
        <div
            className={cn(
                "text-muted-foreground text-sm flex gap-4 hover:bg-muted/65 rounded-sm p-1 relative group",
                isTemp && "opacity-50",
                replyingTo?.id === message.id && "bg-muted/65"
            )}
        >
            {!isTemp && (
                <div className="absolute opacity-0 group-hover:opacity-100 h-6 bg-muted gap-[1px] border-muted border rounded-lg right-3 top-[-12px] z-10 overflow-hidden">
                    <button
                        className="h-full px-3 text-xs bg-background hover:bg-muted/30"
                        onClick={() => {
                            setReplyingTo(message);
                        }}
                    >
                        <Reply className="h-3 w-3" />
                    </button>
                    {/* <MessageReactPopover id={message.id}>
                        <Smile className="h-3 w-3" />
                    </MessageReactPopover> */}
                </div>
            )}
            <div className="w-10 min-w-10">
                {profile.data ? (
                    <ProfileHoverCard profile={profile.data}>
                        <Avatar className={cn(bundled && "hidden", "cursor-pointer")}>
                            <AvatarImage src={profile.data.avatar_url ?? ""} />
                            <AvatarFallback>{profile.data.display_name}</AvatarFallback>
                        </Avatar>
                    </ProfileHoverCard>
                ) : (
                    !bundled && <Skeleton className="w-10 h-10 rounded-full" />
                )}
            </div>
            <div className="overflow-hidden flex-grow">
                {!bundled && (
                    <div className="text-foreground">
                        {profile.data ? (
                            <ProfileHoverCard profile={profile.data}>
                                <span className="cursor-pointer">{profile.data.display_name}</span>
                            </ProfileHoverCard>
                        ) : null}{" "}
                        <span className="text-xs text-muted-foreground/50">{formatTimestamp(message.created_at)}</span>
                    </div>
                )}
                {message.reply_to && <MessageReply {...message.reply_to} />}
                <div
                    className="prose leading-[20px] text-muted-foreground max-w-full break-words min-w-full"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                />
            </div>
        </div>
    );
};

function formatTimestamp(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const options: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    function isToday(date: Date): boolean {
        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    }

    function isYesterday(date: Date): boolean {
        return (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
    }

    if (isToday(date)) {
        return `Today at ${date.toLocaleTimeString(undefined, options)}`;
    } else if (isYesterday(date)) {
        return `Yesterday at ${date.toLocaleTimeString(undefined, options)}`;
    } else {
        return (
            date.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" }) +
            " " +
            date.toLocaleTimeString(undefined, options)
        );
    }
}
