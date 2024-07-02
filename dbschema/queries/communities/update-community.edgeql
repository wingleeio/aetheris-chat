select (
    update Community
    filter .id = <uuid>$community_id
    set {
        name := <str>$name,
        about := <str>$about,
        icon_url := <optional str>$icon_url ?? .icon_url,
        cover_url := <optional str>$cover_url ?? .cover_url,
    }
) {
    id
}