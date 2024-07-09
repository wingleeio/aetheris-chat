select (insert Message {
    sender := <User>global current_user_id,
    content := <str>$content,
    channel := <Channel><uuid>$channel_id,
    reply_to := <Message><optional uuid>$message_id ?? {}
}) {
    id,
    content,
    created_at,
    updated_at,
    sender_id := .sender.id,
    reply_to: {
        id,
        content,
        sender_id := .sender.id
    },
    reactions: {
        id,
        message_id := .message.id,
        emoji_id := .emoji.id,
        emoji_url := .emoji.emoji_url,
        user_id := .user.id
    }
}