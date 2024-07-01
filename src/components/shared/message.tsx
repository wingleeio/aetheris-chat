import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { client } from "@/lib/client";

export const Message = ({
    message,
}: {
    message: Awaited<ReturnType<typeof api.channels.getMessageFromChannel>>["messages"][0];
}) => {
    const profile = client.user.getProfile.useQuery({
        input: {
            user_id: message.sender_id,
        },
    });
    if (!profile.data) {
        return null;
    }
    return (
        <div className="text-muted-foreground text-sm flex gap-4">
            <div>
                <Avatar>
                    <AvatarImage src={profile.data.avatar_url ?? ""} />
                    <AvatarFallback>{profile.data.display_name}</AvatarFallback>
                </Avatar>
            </div>
            <div>
                <div>
                    {profile.data.display_name}{" "}
                    <span className="text-xs text-muted-foreground/50">{formatTimestamp(message.created_at)}</span>
                </div>
                <div>{message.content}</div>
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
