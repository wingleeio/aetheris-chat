CREATE MIGRATION m1vw6iwiac2x5wdf3m5flc7bc6d3mde7n5dnszdi6hplpapsaw5oaq
    ONTO m1yblwzn6pyndyi6byqjtd37ptt2ayhr5hctfgrjgqsowsmirloi3q
{
  ALTER TYPE default::Channel {
      CREATE MULTI LINK allowed_roles: default::CommunityRole;
      CREATE REQUIRED PROPERTY name: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
