with
  email_verification_code := (select EmailVerificationCode filter .user = <User><uuid>global current_user_id),
  expired := email_verification_code.expires_at < datetime_current()
select email_verification_code.code = <str>$code and not expired;