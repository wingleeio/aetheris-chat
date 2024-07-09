import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";
import { EmojiItem, gitHubEmojis } from "@tiptap-pro/extension-emoji";
import { Fragment, useMemo, useState } from "react";

export const MessageReactPopover = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { data } = client.user.getMyEmojis.useQuery();
    const [open, setOpen] = useState(false);

    const emojis = useMemo(() => {
        if (!data) return [];

        const emojis: EmojiItem[] = [];

        data.forEach((emoji) => {
            emojis.push({
                name: emoji.id,
                shortcodes: [emoji.code],
                tags: [emoji.code],
                group: "Community: " + emoji.community.name,
                fallbackImage: emoji.emoji_url,
            });
        });
        return [...emojis, ...gitHubEmojis];
    }, [data]);

    if (!data) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="h-full px-3 text-xs bg-background hover:bg-muted/30">{children}</PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="shadow-none p-1 max-h-[300px] h-[300px] overflow-y-scroll grid grid-cols-8"
            >
                {emojis.map((emoji, i) => (
                    <Fragment key={emoji.name}>
                        {emoji.group !== emojis[i - 1]?.group && (
                            <div
                                className={cn(
                                    "col-span-8 text-muted-foreground text-xs flex items-center p-2 mb-1 bg-muted",
                                    i !== 0 && "mt-1"
                                )}
                            >
                                {emoji.group}
                            </div>
                        )}
                        <button
                            key={emoji.name}
                            className="p-1 flex items-center justify-center hover:bg-muted rounded-sm"
                        >
                            <img src={emoji.fallbackImage} className="w-[1.5em] h-[1.5em]" />
                        </button>
                    </Fragment>
                ))}
            </PopoverContent>
        </Popover>
    );
};
