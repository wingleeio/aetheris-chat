select Community {
    id,
    name,
    about,
    icon_url,
    cover_url,
    is_member := count(.members filter .id = global current_user_id) > 0,
    member_count := count(.members),
    messages_since_yesterday := count(.channels.messages filter .created_at > datetime_current() - <cal::date_duration>'1 day')
}
order by .member_count desc