select Community {
    id,
    name,
    about,
    icon_url,
    cover_url,
    member_count := count(.members),
    owner_id := .owner.id,
    emojis: {
        id,
        code,
        emoji_url,
    }
}
filter .id = <uuid>$community_id