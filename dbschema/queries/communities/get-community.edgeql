select Community {
    id,
    name,
    about,
    icon_url,
    cover_url,
}
filter .id = <uuid>$community_id