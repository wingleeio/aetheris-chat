insert Session {
  session_id := <str>$session_id,
  expires_at := <datetime>$expires_at,
  user := <User><uuid>$user_id,
}