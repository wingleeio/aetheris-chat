select (insert Message {
    sender := <User>global current_user_id,
    content := <str>$content,
    channel := <Channel><uuid>$channel_id
}) {
    id,
    content,
    created_at,
    updated_at,
    sender_id := .sender.id,
}