CREATE MIGRATION m1d2hxj4zz5uif2inxgo4kidxwia5zrnf5irhdqat7sma5i4shtuga
    ONTO m17aqzo7ohi55d2esqw4vc2mbvy4vgcyvhfjwiesryu672rfx7rloa
{
  ALTER TYPE default::EmailVerificationCode {
      ALTER LINK user {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::LastReadChannel {
      ALTER LINK user {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Message {
      ALTER LINK sender {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::OAuth2Account {
      ALTER LINK user {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Profile {
      ALTER LINK user {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Session {
      ALTER LINK user {
          RESET ON SOURCE DELETE;
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
