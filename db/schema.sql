DROP TABLE IF EXISTS pirikas;

CREATE TABLE pirikas (
  id integer PRIMARY KEY AUTOINCREMENT,
  datetime text,
  country text,
  latitude real,
  longitude real,
  key integer,
  address text
);

DROP INDEX gps IF EXISTS gps;
CREATE INDEX gps on pirikas(latitude, longitude);
