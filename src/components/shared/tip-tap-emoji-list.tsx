import { cn } from "@/lib/utils";
import { EmojiItem } from "@tiptap-pro/extension-emoji";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

type TipTapEmojiListProps = {
    items: EmojiItem[];
    command: any;
};

export const TipTapEmojiList = forwardRef<unknown, TipTapEmojiListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command({ name: item.name });
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(
        ref,
        () => {
            return {
                onKeyDown: (x: any) => {
                    if (x.event.key === "ArrowUp") {
                        upHandler();
                        return true;
                    }

                    if (x.event.key === "ArrowDown") {
                        downHandler();
                        return true;
                    }

                    if (x.event.key === "Tab") {
                        downHandler();
                        return true;
                    }

                    if (x.event.key === "Enter") {
                        enterHandler();
                        return true;
                    }

                    return false;
                },
            };
        },
        [upHandler, downHandler, enterHandler]
    );

    return (
        <div className="bg-background shadow-sm border-muted border flex flex-col gap-1 p-1 rounded-lg">
            {props.items.map((item, index) => (
                <div
                    className={cn(
                        index === selectedIndex && "bg-muted",
                        "px-2 py-1 rounded-sm text-sm text-muted-foreground flex gap-10"
                    )}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <div className="flex items-center gap-2 flex-grow">
                        {item.fallbackImage ? (
                            <img src={item.fallbackImage} className="h-[1.5em] w-[1.5em]" />
                        ) : (
                            item.emoji
                        )}
                        :{item.shortcodes[0]}:
                    </div>
                    <div className="align-right text-muted-foreground/50">{item.group}</div>
                </div>
            ))}
        </div>
    );
});
