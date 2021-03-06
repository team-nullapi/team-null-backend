DROP TABLE IF EXISTS users, sadness, neutral, disgust, anger, surprise, fear, happiness;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  username VARCHAR(255),
  fortune TEXT,
  lotto VARCHAR(255),
  dominant_attribute VARCHAR(255),
  sadness VARCHAR(255),
  neutral VARCHAR(255),
  disgust VARCHAR(255),
  anger VARCHAR(255),
  surprise VARCHAR(255),
  fear VARCHAR(255),
  happiness VARCHAR(255),
  created_on BIGINT
);

CREATE TABLE IF NOT EXISTS sadness (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS neutral (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS disgust (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS anger (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS surprise (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS fear (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);

CREATE TABLE IF NOT EXISTS happiness (
  id SERIAL PRIMARY KEY,
  fortune_text TEXT
);