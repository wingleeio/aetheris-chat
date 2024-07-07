select Emoji {
  emoji_url,
}
filter .community = <Community><uuid>$community_id and .code = <str>$code
limit 1