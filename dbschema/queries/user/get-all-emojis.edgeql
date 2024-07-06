select Community {
  id,
  name,
  icon_url,
  emojis: {
    id,
    code,
    emoji_url,
  }
}
filter .members.id = global current_user_id