CREATE MIGRATION m1wbzgg55ng5fyy45twco3hnmxbhn22ct4n5otq7xxdudzluvv4eda
    ONTO m14dcyfojgmovtbydrh7r7ooqgie6ly5i3qd73m2g2i75uzfqon42q
{
  ALTER TYPE default::Channel {
      CREATE MULTI LINK read_status := (.<channel[IS default::LastReadChannel]);
  };
};
