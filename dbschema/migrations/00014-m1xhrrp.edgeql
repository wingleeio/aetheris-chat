CREATE MIGRATION m1xhrrpd3tl7l2z3dafm2tvmkggsz6rhe6qcifk52cqemburujmwpq
    ONTO m1qu6dq5ggoqyyyssjo7veaa4r7mpph3jteahyciumzyrcwl2sn7ba
{
  ALTER TYPE default::LastReadChannel {
      ALTER LINK user {
          ON SOURCE DELETE DELETE TARGET;
      };
  };
  ALTER TYPE default::Message {
      ALTER LINK sender {
          ON TARGET DELETE ALLOW;
      };
  };
};
