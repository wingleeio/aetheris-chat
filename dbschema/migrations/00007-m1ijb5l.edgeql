CREATE MIGRATION m1ijb5llkdw76p6fcvctazpqp3c4dc6x5wctxxv5vp5mm3pgt5xava
    ONTO m1vw6iwiac2x5wdf3m5flc7bc6d3mde7n5dnszdi6hplpapsaw5oaq
{
  ALTER TYPE default::Community {
      CREATE INDEX fts::index ON ((fts::with_options(.name, language := fts::Language.eng), fts::with_options(.about, language := fts::Language.eng)));
  };
};
