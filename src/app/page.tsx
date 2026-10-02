import Link from "next/link";
import { MovieCard } from "@/components/movie-card";
import { SearchForm } from "@/components/search-form";
import { getGenres, searchMovies } from "@/lib/movies";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const genreParam = typeof params.genre === "string" ? params.genre : "";
  const genreId = genreParam ? Number(genreParam) : undefined;

  const [movies, genres] = await Promise.all([
    searchMovies({ q, genreId }),
    getGenres(),
  ]);

  const activeGenre = genres.find((genre) => genre.id === genreId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-pretty sm:text-4xl">
          {activeGenre ? `${activeGenre.name} Movies` : "Find Your Next Watch"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Search by title or plot, or filter by genre.
        </p>
      </header>

      <SearchForm genres={genres} q={q} genreId={genreId} />

      <p className="mt-8 text-sm text-zinc-400" aria-live="polite">
        {movies.length} {movies.length === 1 ? "result" : "results"}
        {q ? ` for “${q}”` : ""}
      </p>

      {movies.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-12 text-center">
          <p className="font-medium text-zinc-200">No Movies Found</p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different title, or clear the filters.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 text-sm transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie, index) => (
            <li key={movie.id}>
              <MovieCard movie={movie} priority={index < 5} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
