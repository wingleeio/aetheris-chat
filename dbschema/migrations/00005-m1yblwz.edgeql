CREATE MIGRATION m1yblwzn6pyndyi6byqjtd37ptt2ayhr5hctfgrjgqsowsmirloi3q
    ONTO m1bmo2ejptkxiwnidwmwyq7z54l3ychnw7qqq7mwidmxruny53pm2a
{
  ALTER TYPE default::Community {
      CREATE REQUIRED PROPERTY about: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
