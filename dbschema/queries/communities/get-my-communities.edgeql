select Community {
    name,
    icon_url,
    cover_url,
    member_count := count(.members)
}
filter .members = <User>global current_user_id