select (insert MessageReact {
    message := <Message><uuid>$message_id,
    user := <User>global current_user_id,
    emoji := <Emoji><uuid>$emoji_id
}) {
    id,
    message_id := .message.id,
    emoji_id := .emoji.id,
    emoji_url := .emoji.emoji_url,
    user_id := .user.id
}