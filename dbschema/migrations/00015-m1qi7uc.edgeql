CREATE MIGRATION m1qi7ucjt7zy77qhrotm4cqxopirs74v4vqltuso7xzqfwuwsqxwza
    ONTO m1xhrrpd3tl7l2z3dafm2tvmkggsz6rhe6qcifk52cqemburujmwpq
{
  ALTER TYPE default::EmailVerificationCode {
      ALTER LINK user {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::LastReadChannel {
      ALTER LINK user {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::OAuth2Account {
      ALTER LINK user {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Profile {
      ALTER LINK user {
          ON TARGET DELETE ALLOW;
      };
  };
};
