-- pg_trgm lets GIN indexes accelerate ILIKE '%substring%' searches.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN indexes for the title/overview substring search.
CREATE INDEX IF NOT EXISTS "movies_title_trgm_idx"
  ON "movies" USING gin ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "movies_overview_trgm_idx"
  ON "movies" USING gin ("overview" gin_trgm_ops);

-- Postgres does NOT auto-index foreign keys. Without these, deleting a genre
-- or a movie forces a sequential scan of the referencing table to enforce
-- the ON DELETE CASCADE.
CREATE INDEX IF NOT EXISTS "movies_genres_genre_id_idx"
  ON "movies_genres" ("genre_id");
CREATE INDEX IF NOT EXISTS "watchlist_movie_id_idx"
  ON "watchlist" ("movie_id");
