select Community {
    id,
    name,
    about,
    icon_url,
    cover_url,
    member_count := count(.members),
    messages_since_yesterday := count(.channels.messages filter .created_at > datetime_current() - <cal::date_duration>'1 day'),
    has_unread := count(
        .channels.messages 
        filter .created_at > 
        (select .channel.read_status filter .user = <User>global current_user_id).last_read_at
    ) > 0,
}
filter .members = <User>global current_user_id
order by .created_at desc