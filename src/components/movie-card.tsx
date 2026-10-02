import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/images";
import type { MovieWithGenres } from "@/lib/movies";

export function MovieCard({
  movie,
  priority = false,
}: {
  movie: MovieWithGenres;
  priority?: boolean;
}) {
  const genreNames = movie.moviesGenres
    .map((link) => link.genre.name)
    .join(" · ");

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <div className="relative aspect-2/3 overflow-hidden bg-zinc-800">
        <Image
          src={posterUrl(movie.posterPath, movie.title)}
          alt={`${movie.title} poster`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {movie.rating ? (
          <span className="absolute top-2 left-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-accent-soft tabular-nums backdrop-blur-sm">
            {movie.rating}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 text-sm leading-snug font-semibold text-pretty">
          {movie.title}
        </h2>
        <p className="mt-auto truncate text-xs text-zinc-500">
          {movie.releaseYear} · {genreNames}
        </p>
      </div>
    </Link>
  );
}
