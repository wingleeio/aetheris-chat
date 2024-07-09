with
    cursor := <optional uuid>$cursor ?? <uuid>"00000000-0000-0000-0000-000000000000",
    take  := <optional int64>$take ?? <int64>30,
    last_created_at := (select Message { created_at } filter .id = cursor).created_at ?? datetime_of_statement(),
    channel_id := <uuid>$channel_id,
    messages := (
        select Message
        filter .channel.id = channel_id and .created_at < last_created_at
        order by .created_at desc
        limit take
    ),
    remaining := count((select Message filter .channel.id = channel_id and .created_at < last_created_at)),
    has_more := remaining > count(messages)
select {
    messages := messages {
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
    },
    has_more := has_more
}
