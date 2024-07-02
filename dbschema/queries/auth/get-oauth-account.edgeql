select OAuth2Account {
  user_id := .user.id,
}
filter .provider_user_id = <str>$provider_user_id;