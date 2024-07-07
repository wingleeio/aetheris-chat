import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { client, useAetherisContext } from "@/lib/client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddEmojiDialog } from "@/components/communities/add-emoji-dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { helpers } from "@/lib/api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export const EmojiManagementDialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { queryClient } = useAetherisContext();
    const params = useParams<{ community: string }>();
    const { data } = client.communities.getCommunity.useQuery({
        input: {
            id: params.community,
        },
    });

    const deleteEmoji = client.communities.deleteEmoji.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: helpers.communities.getCommunity.getQueryKey({
                    id: params.community,
                }),
            });
        },
    });

    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Emojis</DialogTitle>
                    <DialogDescription>Add or remove emojis from your community</DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-1">
                    {data.emojis.map((emoji) => (
                        <div key={emoji.id}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <ConfirmDialog
                                        title="Delete Emoji"
                                        description="Are you sure you want to delete this emoji?"
                                        onConfirm={() => {
                                            deleteEmoji.mutate({
                                                emoji_id: emoji.id,
                                            });
                                        }}
                                    >
                                        <img src={emoji.emoji_url} className="h-[24px] w-[24px]" />
                                    </ConfirmDialog>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">
                                    :{emoji.code}:
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <AddEmojiDialog>
                        <Button>Add Emoji</Button>
                    </AddEmojiDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
