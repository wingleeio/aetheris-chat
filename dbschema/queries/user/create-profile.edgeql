insert Profile {
    display_name := <str>$display_name,
    tag := <str>$tag,
    bio := <optional str>$bio,
    avatar_url := <optional str>$avatar_url,
    cover_url := <optional str>$cover_url,
    user := <User>global current_user_id
}