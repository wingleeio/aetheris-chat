delete MessageReact
filter .message.id = <uuid>$message_id
    and .user.id = global current_user_id
    and .emoji.id = <uuid>$emoji_id