CREATE MIGRATION m1fizo3x5uncd5ysvy7257s4liaugpj2fuyerfllqvhaztekzwgzkq
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
  CREATE TYPE default::User EXTENDING default::Base {
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY email_verified: std::bool;
      CREATE PROPERTY hashed_password: std::str;
  };
  CREATE TYPE default::EmailVerificationCode EXTENDING default::Base {
      CREATE REQUIRED LINK user: default::User {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.user);
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
      CREATE REQUIRED LINK user: default::User;
  };
  CREATE TYPE default::Session EXTENDING default::Base {
      CREATE REQUIRED PROPERTY session_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.session_id);
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY expires_at: std::datetime;
  };
};
