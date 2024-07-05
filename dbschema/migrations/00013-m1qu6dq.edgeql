CREATE MIGRATION m1qu6dq5ggoqyyyssjo7veaa4r7mpph3jteahyciumzyrcwl2sn7ba
    ONTO m1gvame7o2vl3v3w7li4qmm54up7nflqu425vnlsdeywmsa53ltnsq
{
  ALTER TYPE default::Community {
      ALTER LINK members {
          ON TARGET DELETE ALLOW;
      };
  };
};
