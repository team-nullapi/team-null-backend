DROP TABLE IF EXISTS users, sadness, neutral, disgust, anger, surprise, fear, happiness;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL, 
  username PRIMARY KEY VARCHAR(255),
  fortune TEXT,
  lotto VARCHAR(255)
  dominant_attribute VARCHAR(255);
  created_on BIGINT
);

CREATE TABLE IF NOT EXISTS sadness (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS neutral (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS disgust (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS anger (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS surprise (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS fear (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);

CREATE TABLE IF NOT EXISTS happiness (
  id PRIMARY KEY SERIAL,
  fortune_text TEXT,
);