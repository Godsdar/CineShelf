import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WatchlistControls } from "@/components/watchlist-controls";
import { posterUrl } from "@/lib/images";
import { getCurrentUser } from "@/lib/user";
import { getWatchlistForUser } from "@/lib/watchlist";

export const metadata = {
  title: "My Watchlist",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default async function WatchlistPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/signin");
  }

  const items = await getWatchlistForUser(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {items.length} {items.length === 1 ? "movie" : "movies"} saved
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
          <p className="font-medium text-zinc-200">Your Watchlist Is Empty</p>
          <p className="mt-1 text-sm text-zinc-500">
            Save movies to keep track of what to watch next.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(({ movie, watched, addedAt }, index) => {
            const genreNames = movie.moviesGenres
              .map((link) => link.genre.name)
              .join(" · ");

            return (
              <li
                key={movie.id}
                className="flex gap-4 rounded-2xl bg-surface p-3 ring-1 ring-white/10"
              >
                <Link
                  href={`/movies/${movie.id}`}
                  className="relative aspect-2/3 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:w-20"
                >
                  <Image
                    src={posterUrl(movie.posterPath, movie.title)}
                    alt={`${movie.title} poster`}
                    fill
                    priority={index === 0}
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start gap-2">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="min-w-0 text-pretty font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    >
                      {movie.title}
                    </Link>
                    {watched ? (
                      <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent-soft uppercase">
                        Watched
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {movie.releaseYear} · {genreNames}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Added {dateFormatter.format(addedAt)}
                  </p>

                  <div className="mt-auto pt-3">
                    <WatchlistControls
                      movieId={movie.id}
                      inWatchlist
                      watched={watched}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
