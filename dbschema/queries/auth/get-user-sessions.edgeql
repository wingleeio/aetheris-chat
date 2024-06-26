select Session {
  id,
  session_id,
  expires_at,
  user: {
    id
  }
} filter .user = <User><uuid>$user_id;