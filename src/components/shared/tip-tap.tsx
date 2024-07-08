"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import Emoji, { EmojiItem, gitHubEmojis } from "@tiptap-pro/extension-emoji";
import { TipTapEmojiSuggestion } from "@/components/shared/tip-tap-emoji-suggestion";

interface TipTapProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onSubmit?: () => void;
    onChange?: (content: string) => void;
    emojis?: EmojiItem[];
}

export const TipTap = (props: TipTapProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: "is-editor-empty text-muted-foreground/50",
                placeholder: props.placeholder ?? "Write something...",
            }),
            Emoji.configure({
                emojis: props.emojis ? [...props.emojis, ...gitHubEmojis] : [...gitHubEmojis],
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
