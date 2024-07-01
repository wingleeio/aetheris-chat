select Profile {
    id,
    display_name,
    tag,
    avatar_url,
    cover_url,
    bio,
}
filter .user.id = <uuid>$user_id