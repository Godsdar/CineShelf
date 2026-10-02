import Link from "next/link";

export default function MovieNotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center">
      <p className="text-sm font-semibold text-accent-soft">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-pretty">
        Movie Not Found
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        That movie is not in the database.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        Back to Search
      </Link>
    </div>
  );
}
