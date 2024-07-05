CREATE MIGRATION m17aqzo7ohi55d2esqw4vc2mbvy4vgcyvhfjwiesryu672rfx7rloa
    ONTO m1qi7ucjt7zy77qhrotm4cqxopirs74v4vqltuso7xzqfwuwsqxwza
{
  ALTER TYPE default::Session {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
          ON TARGET DELETE ALLOW;
      };
  };
};
