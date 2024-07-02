update User
filter .id = <uuid>$user_id
set {
    email := <optional str>$email ?? .email,
    hashed_password := <optional str>$hashed_password ?? .hashed_password,
    email_verified := <optional bool>$email_verified ?? .email_verified,
}