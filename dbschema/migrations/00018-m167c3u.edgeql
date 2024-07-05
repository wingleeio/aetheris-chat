CREATE MIGRATION m167c3ufplehndlmfhr6n7mnebjrekg2tr3544wumklud436jotoua
    ONTO m1d2hxj4zz5uif2inxgo4kidxwia5zrnf5irhdqat7sma5i4shtuga
{
  CREATE TYPE default::Emoji EXTENDING default::Base {
      CREATE REQUIRED LINK community: default::Community;
      CREATE REQUIRED PROPERTY code: std::str;
      CREATE CONSTRAINT std::exclusive ON ((.community, .code));
      CREATE REQUIRED PROPERTY emoji_url: std::str;
  };
  ALTER TYPE default::Community {
      CREATE MULTI LINK emojis := (.<community[IS default::Emoji]);
  };
  CREATE TYPE default::MessageReact EXTENDING default::Base {
      CREATE REQUIRED LINK emoji: default::Emoji {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK message: default::Message {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE CONSTRAINT std::exclusive ON ((.message, .user, .emoji));
  };
  ALTER TYPE default::Message {
      CREATE MULTI LINK reactions := (.<message[IS default::MessageReact]);
  };
};
