update Profile
filter .user.id = global current_user_id
set {
    display_name := <optional str>$display_name ?? .display_name,
    tag := <optional str>$tag ?? .tag,
    bio := <optional str>$bio ?? .bio,
    avatar_url := <optional str>$avatar_url ?? .avatar_url,
    cover_url := <optional str>$cover_url ?? .cover_url,
}