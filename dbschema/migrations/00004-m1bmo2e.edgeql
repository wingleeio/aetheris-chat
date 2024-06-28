CREATE MIGRATION m1bmo2ejptkxiwnidwmwyq7z54l3ychnw7qqq7mwidmxruny53pm2a
    ONTO m16ueushfej3lb6bwp6up2wfzitv7mqg5fojxzqonimrhzmi7tigba
{
  ALTER TYPE default::Community {
      CREATE PROPERTY cover_url: std::str;
      CREATE PROPERTY icon_url: std::str;
  };
};
