CREATE MIGRATION m14lw24q5gxqbph4kqtwhh7bzhymyaw4kvcp3nn6a5f6bm73uqgv2a
    ONTO m1246mwj2e3qlm5rb4fyzjkmpn7yxfl7f2xpvjbjpyisrtbnjebyhq
{
  ALTER TYPE default::Message {
      CREATE LINK reply_to: default::Message;
  };
};
