select Emoji {
  id,
  code,
  emoji_url,
}
filter .community.members.id = global current_user_id