select (insert Community {
    name := <str>$name,
    about := <str>$about,
    icon_url := <optional str>$icon_url,
    cover_url := <optional str>$cover_url,
    owner := <User>global current_user_id,
    members := (
        select User
        filter .id = global current_user_id
    )
}) {
    id
}