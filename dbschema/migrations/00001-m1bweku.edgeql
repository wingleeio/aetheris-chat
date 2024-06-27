CREATE MIGRATION m1bwekumhc7ao34uolhl4ue5zx2krgb4hwb5q6cp2sd7wlqr2zarna
    ONTO initial
{
  CREATE ABSTRACT TYPE default::Base {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::EmailVerificationCode EXTENDING default::Base {
      CREATE REQUIRED PROPERTY code: std::str;
      CREATE REQUIRED PROPERTY expires_at: std::datetime;
  };
  CREATE TYPE default::OAuth2Account EXTENDING default::Base {
      CREATE REQUIRED PROPERTY provider: std::str;
      CREATE INDEX ON (.provider);
      CREATE REQUIRED PROPERTY provider_user_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.provider_user_id);
  };
  CREATE TYPE default::Profile EXTENDING default::Base {
      CREATE REQUIRED PROPERTY display_name: std::str;
      CREATE REQUIRED PROPERTY tag: std::str {
          CREATE CONSTRAINT std::expression ON ((((__subject__ LIKE '#%') AND ((__subject__)[1:] NOT LIKE '%[^a-zA-Z0-9]%')) AND ((__subject__)[1:] NOT LIKE '#%')));
      };
      CREATE CONSTRAINT std::exclusive ON ((.display_name, .tag));
      CREATE PROPERTY avatar_url: std::str;
      CREATE PROPERTY bio: std::str;
      CREATE PROPERTY cover_url: std::str;
  };
  CREATE TYPE default::Session EXTENDING default::Base {
      CREATE REQUIRED PROPERTY session_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.session_id);
      CREATE REQUIRED PROPERTY expires_at: std::datetime;
  };
  CREATE TYPE default::User EXTENDING default::Base {
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY email_verified: std::bool;
      CREATE PROPERTY hashed_password: std::str;
  };
  ALTER TYPE default::EmailVerificationCode {
      CREATE REQUIRED LINK user: default::User {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.user);
  };
  ALTER TYPE default::OAuth2Account {
      CREATE REQUIRED LINK user: default::User;
  };
  ALTER TYPE default::Profile {
      CREATE REQUIRED LINK user: default::User {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE SINGLE LINK profile := (.<user[IS default::Profile]);
  };
  ALTER TYPE default::Session {
      CREATE REQUIRED LINK user: default::User;
  };
};
