CREATE MIGRATION m1gvame7o2vl3v3w7li4qmm54up7nflqu425vnlsdeywmsa53ltnsq
    ONTO m1wbzgg55ng5fyy45twco3hnmxbhn22ct4n5otq7xxdudzluvv4eda
{
  ALTER TYPE default::EmailVerificationCode {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  ALTER TYPE default::Message {
      ALTER LINK sender {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  ALTER TYPE default::OAuth2Account {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  ALTER TYPE default::Profile {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
};
