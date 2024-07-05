CREATE MIGRATION m1v7fl33lw2fn7nbzgvi56fxeqncfovwrxqkeecdfuwfn443f6tmia
    ONTO m1ijb5llkdw76p6fcvctazpqp3c4dc6x5wctxxv5vp5mm3pgt5xava
{
  ALTER TYPE default::Message {
      CREATE MULTI LINK read_by: default::User;
  };
};
