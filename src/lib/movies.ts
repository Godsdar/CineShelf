import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { genres, movies } from "@/db/schema";

const withGenres = {
  moviesGenres: {
    with: { genre: true },
  },
} as const;

export type MovieWithGenres = Awaited<ReturnType<typeof getMovies>>[number];

/**
 * Newest/highest rated first. `cache` dedupes identical calls within one
 * server render, so several components can ask for the same data for free.
 */
export const getMovies = cache(async (limit = 24, offset = 0) => {
  return db.query.movies.findMany({
    with: withGenres,
    orderBy: [desc(movies.rating), asc(movies.title)],
    limit,
    offset,
  });
});

export const getMovieById = cache(async (id: number) => {
  return db.query.movies.findFirst({
    where: eq(movies.id, id),
    with: withGenres,
  });
});

/**
 * Movies that share at least one genre with the given movie, excluding itself.
 * Another correlated EXISTS subquery, this time with a nested subquery for the
 * movie's own genres.
 */
export const getRelatedMovies = cache(async (movieId: number, limit = 5) => {
  return db.query.movies.findMany({
    where: sql`${movies.id} <> ${movieId}
      and exists (
        select 1 from movies_genres mg
        where mg.movie_id = ${movies.id}
          and mg.genre_id in (
            select genre_id from movies_genres where movie_id = ${movieId}
          )
      )`,
    with: withGenres,
    orderBy: [desc(movies.rating), asc(movies.title)],
    limit,
  });
});

export const getGenres = cache(async () => {
  return db.query.genres.findMany({ orderBy: [asc(genres.name)] });
});

export type Genre = Awaited<ReturnType<typeof getGenres>>[number];

/**
 * Case-insensitive substring search on title + overview, optionally narrowed
 * to one genre. The genre filter uses EXISTS instead of a JOIN so a movie can
 * never appear twice in the results.
 */
export const searchMovies = cache(
  async ({ q, genreId }: { q?: string; genreId?: number }) => {
    const conditions: SQL[] = [];

    if (q) {
      conditions.push(
        or(ilike(movies.title, `%${q}%`), ilike(movies.overview, `%${q}%`))!,
      );
    }

    if (genreId) {
      conditions.push(
        sql`exists (
          select 1 from movies_genres mg
          where mg.movie_id = ${movies.id}
            and mg.genre_id = ${genreId}
        )`,
      );
    }

    return db.query.movies.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: withGenres,
      orderBy: [desc(movies.rating), asc(movies.title)],
      limit: 60,
    });
  },
);
