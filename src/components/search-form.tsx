import Link from "next/link";
import type { Genre } from "@/lib/movies";

function genreHref(q: string, genreId?: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (genreId) params.set("genre", String(genreId));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function chipClass(active: boolean): string {
  const base =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return active
    ? `${base} border-accent bg-accent text-white`
    : `${base} border-white/15 text-zinc-300 hover:border-white/30 hover:text-foreground`;
}

export function SearchForm({
  genres,
  q,
  genreId,
}: {
  genres: Genre[];
  q: string;
  genreId?: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <form
        method="get"
        action="/"
        role="search"
        className="flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <label htmlFor="q" className="sr-only">
            Search movies
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by title or plot…"
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pr-3 pl-9 text-sm transition outline-none focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40"
          />
        </div>

        {genreId ? <input type="hidden" name="genre" value={genreId} /> : null}

        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={genreHref(q)}
          aria-current={genreId ? undefined : "true"}
          className={chipClass(!genreId)}
        >
          All
        </Link>
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={genreHref(q, genre.id)}
            aria-current={genreId === genre.id ? "true" : undefined}
            className={chipClass(genreId === genre.id)}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
