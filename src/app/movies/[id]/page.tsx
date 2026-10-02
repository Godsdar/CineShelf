import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovieCard } from "@/components/movie-card";
import { WatchlistControls } from "@/components/watchlist-controls";
import { posterUrl } from "@/lib/images";
import { getMovieById, getRelatedMovies } from "@/lib/movies";
import { getCurrentUser } from "@/lib/user";
import { getWatchlistEntry } from "@/lib/watchlist";

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${rest}m` : `${rest}m`;
}

export async function generateMetadata({ params }: PageProps<"/movies/[id]">) {
  const { id } = await params;
  const movie = await getMovieById(Number(id));

  if (!movie) {
    return { title: "Movie Not Found" };
  }

  return {
    title: `${movie.title} (${movie.releaseYear})`,
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: PageProps<"/movies/[id]">) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId)) {
    notFound();
  }

  const movie = await getMovieById(movieId);

  if (!movie) {
    notFound();
  }

  const related = await getRelatedMovies(movieId);
  const user = await getCurrentUser();
  const entry = user ? await getWatchlistEntry(user.id, movieId) : null;

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg text-sm text-zinc-400 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to Search
      </Link>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/10 sm:w-56 lg:w-64">
          <Image
            src={posterUrl(movie.posterPath, movie.title)}
            alt={`${movie.title} poster`}
            fill
            priority
            sizes="(max-width: 640px) 160px, 256px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pretty sm:text-4xl">
              {movie.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-zinc-400">
              <span className="tabular-nums">{movie.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatRuntime(movie.runtime)}</span>
              {movie.rating ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-accent-soft tabular-nums">
                    {movie.rating}
                    <span className="font-normal text-zinc-500">/10</span>
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.moviesGenres.map((link) => (
              <Link
                key={link.genre.id}
                href={`/?genre=${link.genre.id}`}
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-white/30 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                {link.genre.name}
              </Link>
            ))}
          </div>

          <p className="max-w-prose leading-relaxed text-pretty text-zinc-300">
            {movie.overview}
          </p>

          <WatchlistControls
            movieId={movie.id}
            inWatchlist={Boolean(entry)}
            watched={entry?.watched ?? false}
          />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-lg font-semibold tracking-tight"
          >
            More Like This
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((item) => (
              <li key={item.id}>
                <MovieCard movie={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
