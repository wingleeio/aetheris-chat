CREATE MIGRATION m14dcyfojgmovtbydrh7r7ooqgie6ly5i3qd73m2g2i75uzfqon42q
    ONTO m1rbekfrnw3rijjeoesyofllhzecnveqca77r2pafarvikiw7ss7hq
{
  ALTER TYPE default::LastReadChannel {
      DROP LINK message;
  };
  ALTER TYPE default::LastReadChannel {
      CREATE REQUIRED PROPERTY last_read_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
