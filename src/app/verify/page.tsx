import Link from "next/link";

export const metadata = {
  title: "Check Your Email",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-pretty">
        Check Your Email
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        We sent you a sign-in link. Open it on this device to finish signing in.
      </p>

      <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 text-left text-xs text-zinc-400">
        In development the link is printed in the terminal running{" "}
        <code className="text-zinc-300">bun run dev</code> — no email is sent
        unless <code className="text-zinc-300">EMAIL_SERVER</code> is configured.
      </p>

      <Link
        href="/signin"
        className="mt-6 inline-block rounded-lg text-sm text-accent-soft transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
