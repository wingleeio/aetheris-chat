select exists(
  select Emoji filter .code = <str>$code and .community = <Community><uuid>$community_id
)