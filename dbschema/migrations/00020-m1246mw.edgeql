CREATE MIGRATION m1246mwj2e3qlm5rb4fyzjkmpn7yxfl7f2xpvjbjpyisrtbnjebyhq
    ONTO m1mv7g4l3q5nycbfmtln3he234gbng6lgk6csnlfo7uwnuteetu33q
{
  ALTER TYPE default::Community {
      DROP INDEX fts::index ON ((fts::with_options(.name, language := fts::Language.eng), fts::with_options(.about, language := fts::Language.eng)));
  };
  ALTER TYPE default::Emoji {
      DROP INDEX fts::index ON (fts::with_options(.code, language := fts::Language.eng));
  };
};
