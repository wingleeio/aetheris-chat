CREATE MIGRATION m1mv7g4l3q5nycbfmtln3he234gbng6lgk6csnlfo7uwnuteetu33q
    ONTO m167c3ufplehndlmfhr6n7mnebjrekg2tr3544wumklud436jotoua
{
  ALTER TYPE default::Emoji {
      CREATE INDEX fts::index ON (fts::with_options(.code, language := fts::Language.eng));
  };
};
