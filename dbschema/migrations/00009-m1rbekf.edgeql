CREATE MIGRATION m1rbekfrnw3rijjeoesyofllhzecnveqca77r2pafarvikiw7ss7hq
    ONTO m1v7fl33lw2fn7nbzgvi56fxeqncfovwrxqkeecdfuwfn443f6tmia
{
  CREATE TYPE default::LastReadChannel EXTENDING default::Base {
      CREATE REQUIRED LINK channel: default::Channel;
      CREATE REQUIRED LINK user: default::User;
      CREATE CONSTRAINT std::exclusive ON ((.user, .channel));
      CREATE REQUIRED LINK message: default::Message;
  };
  ALTER TYPE default::Message {
      DROP LINK read_by;
  };
};
