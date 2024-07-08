"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import Emoji, { EmojiItem, gitHubEmojis } from "@tiptap-pro/extension-emoji";
import { TipTapEmojiSuggestion } from "@/components/shared/tip-tap-emoji-suggestion";
import { client } from "@/lib/client";

interface TipTapProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSubmit?: () => void;
    onChange?: (content: string) => void;
}

export const TipTap = (props: TipTapProps) => {
    const { data } = client.user.getMyEmojis.useQuery();
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
        return emojis;
    }, [data]);

    if (!data) return null;

    return <_TipTap {...props} emojis={emojis} />;
};

const _TipTap = (props: TipTapProps & { emojis: EmojiItem[] }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: "is-editor-empty text-muted-foreground/50",
                placeholder: props.placeholder ?? "Write something...",
            }),
            Emoji.configure({
                emojis: [...props.emojis, ...gitHubEmojis],
                enableEmoticons: true,
                suggestion: TipTapEmojiSuggestion,
            }),
            Extension.create({
                addKeyboardShortcuts() {
                    return {
                        Enter: ({ editor }) => {
                            //@ts-ignore
                            const suggestions = editor.state["emojiSuggestion$"].active;
                            if (suggestions) {
                                return false;
                            }
                            if (props.onSubmit) {
                                props.onSubmit();
                            }
                            return true;
                        },
                        ["Shift-Enter"]: ({ editor }) => {
                            return editor.commands.first(({ commands }) => [
                                () => commands.newlineInCode(),
                                () => commands.createParagraphNear(),
                                () => commands.liftEmptyBlock(),
                                () => commands.splitBlock(),
                            ]);
                        },
                    };
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: cn("prose leading-[20px] max-w-full break-words overflow-hidden", props.className),
            },
        },
        onUpdate: ({ editor }) => {
            if (props.onChange) {
                props.onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (!editor) return;
        let html = editor.getHTML();
        if (html !== props.value) {
            editor.commands.setContent(props.value ?? "");
        }
    }, [editor, props.value]);

    return <EditorContent editor={editor} className="overflow-hidden max-w-full" />;
};
