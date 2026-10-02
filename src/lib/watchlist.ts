import { and, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { watchlist } from "@/db/schema";

export const getWatchlistForUser = cache(async (userId: string) => {
  return db.query.watchlist.findMany({
    where: eq(watchlist.userId, userId),
    with: {
      movie: {
        with: {
          moviesGenres: { with: { genre: true } },
        },
      },
    },
    orderBy: [desc(watchlist.addedAt)],
  });
});

export const getWatchlistEntry = cache(
  async (userId: string, movieId: number) => {
    return db.query.watchlist.findFirst({
      where: and(
        eq(watchlist.userId, userId),
        eq(watchlist.movieId, movieId),
      ),
    });
  },
);

export type WatchlistItem = Awaited<
  ReturnType<typeof getWatchlistForUser>
>[number];
