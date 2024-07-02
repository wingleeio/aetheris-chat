update Session
filter .session_id = <str>$session_id
set {
  expires_at := <datetime>$expires_at
}