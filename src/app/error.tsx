"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-pretty">
        Something Went Wrong
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        {error.message || "An unexpected error occurred."}
      </p>
      {error.digest ? (
        <p className="mt-1 font-mono text-xs text-zinc-600">
          digest: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        Try Again
      </button>
    </div>
  );
}
