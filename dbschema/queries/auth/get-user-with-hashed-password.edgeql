select User {
  id,
  hashed_password
}
filter .email = <str>$email