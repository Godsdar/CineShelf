import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SubmitButton } from "@/components/submit-button";
import {
  signInWithEmail,
  signInWithGitHub,
  signInWithGoogle,
} from "@/lib/auth-actions";

export const metadata = {
  title: "Sign In",
};

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/watchlist");
  }

  const hasGitHub = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );
  const hasGoogle = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-pretty">
        Sign In
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Save movies to your watchlist across devices.
      </p>

      {hasGitHub || hasGoogle ? (
        <div className="mt-8 flex flex-col gap-3">
          {hasGitHub ? (
            <form action={signInWithGitHub}>
              <SubmitButton
                variant="secondary"
                pendingLabel="Redirecting…"
                className="w-full"
              >
                <GitHubIcon />
                Continue with GitHub
              </SubmitButton>
            </form>
          ) : null}

          {hasGoogle ? (
            <form action={signInWithGoogle}>
              <SubmitButton
                variant="secondary"
                pendingLabel="Redirecting…"
                className="w-full"
              >
                <GoogleIcon />
                Continue with Google
              </SubmitButton>
            </form>
          ) : null}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
          Google and GitHub sign-in are not configured. Add{" "}
          <code className="text-zinc-300">AUTH_GOOGLE_ID/SECRET</code> or{" "}
          <code className="text-zinc-300">AUTH_GITHUB_ID/SECRET</code> to{" "}
          <code className="text-zinc-300">.env</code>, then restart the server.
        </p>
      )}

      <div className="my-8 flex items-center gap-3 text-xs text-zinc-500">
        <span className="h-px flex-1 bg-white/10" />
        Or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form action={signInWithEmail} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm transition outline-none focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <SubmitButton pendingLabel="Sending link…">
          Email Me a Sign-In Link
        </SubmitButton>
      </form>
    </div>
  );
}
