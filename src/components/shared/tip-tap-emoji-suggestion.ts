import { Editor, ReactRenderer } from "@tiptap/react";
import { TipTapEmojiList } from "@/components/shared/tip-tap-emoji-list";
import tippy from "tippy.js";

export const TipTapEmojiSuggestion: any = {
    items: ({ editor, query }: { editor: Editor; query: string }) => {
        return editor.storage.emoji.emojis
            .filter(({ shortcodes, tags }: { shortcodes: string[]; tags: string[] }) => {
                return (
                    shortcodes.find((shortcode) => shortcode.startsWith(query.toLowerCase())) ||
                    tags.find((tag) => tag.startsWith(query.toLowerCase()))
                );
            })
            .slice(0, 5);
    },

    allowSpaces: false,

    render: () => {
        let component: ReactRenderer;
        let popup: ReturnType<typeof tippy>;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(TipTapEmojiList, {
                    props,
                    editor: props.editor,
                });
                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate(props: any) {
                component.updateProps(props);
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                    popup[0].hide();
                    component.destroy();

                    return true;
                }

                return (component.ref as any)?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
