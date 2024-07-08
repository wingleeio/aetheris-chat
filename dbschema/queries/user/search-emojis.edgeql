select Emoji {
  id,
  code,
  emoji_url,
  community: {
    id,
    name,
    icon_url
  }
}
filter .community.members.id = global current_user_id
and .code like '%' ++ <str>$search ++ '%'