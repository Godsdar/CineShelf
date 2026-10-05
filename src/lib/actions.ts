"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { parseMovieId } from "@/lib/validate";

/**
 * Server Actions are public POST endpoints, so authorization must be checked
 * here on the server, not just by hiding the buttons in the UI.
 */
async function requireUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return session.user.id;
}

function revalidateWatchlist(movieId: number) {
  revalidatePath(`/movies/${movieId}`);
  revalidatePath("/watchlist");
}

export async function addToWatchlist(formData: FormData) {
  const movieId = parseMovieId(formData);
  const userId = await requireUserId();

  await db
    .insert(watchlist)
    .values({ userId, movieId })
    .onConflictDoNothing();

  revalidateWatchlist(movieId);
}

export async function removeFromWatchlist(formData: FormData) {
  const movieId = parseMovieId(formData);
  const userId = await requireUserId();

  await db
    .delete(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));

  revalidateWatchlist(movieId);
}

export async function toggleWatched(formData: FormData) {
  const movieId = parseMovieId(formData);
  const userId = await requireUserId();

  // Flip the boolean in the database itself, so two rapid clicks cannot
  // clobber each other with a stale value read in JS.
  await db
    .update(watchlist)
    .set({ watched: sql`not ${watchlist.watched}` })
    .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));

  revalidateWatchlist(movieId);
}
