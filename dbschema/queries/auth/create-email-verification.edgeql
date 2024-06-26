select (insert EmailVerificationCode {
      user := <User><uuid>$user_id,
      code := <str>$code,
      expires_at := <datetime>$expires_at
}) {
  code,
}