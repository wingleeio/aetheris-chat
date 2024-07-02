with
  session := (select Session filter .session_id = <str>$session_id),
  user := (select User filter .id = session.user.id),
select session {
  id,
  session_id,
  expires_at,
  user: {
    id,
    email,
    email_verified,
    profile: {
      avatar_url,
      cover_url,
      display_name,
      tag,
    }
  }
}