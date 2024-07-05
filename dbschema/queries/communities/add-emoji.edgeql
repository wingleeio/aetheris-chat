select(insert Emoji {
    community := <Community><uuid>$community_id,
    code := <str>$code,
    emoji_url := <str>$emoji_url
}) {
    id,
    code,
    emoji_url,
}