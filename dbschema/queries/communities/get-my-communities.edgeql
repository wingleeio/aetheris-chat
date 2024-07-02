select Community {
    id,
    name,
    about,
    icon_url,
    cover_url,
    member_count := count(.members),
    messages_since_yesterday := count(.messages filter .created_at > datetime_current() - <cal::date_duration>'1 day')
}
filter .members = <User>global current_user_id
order by .created_at desc