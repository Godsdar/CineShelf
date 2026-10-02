import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/auth-actions";

function initials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "?";

  const parts = source.split(/[\s@._-]+/).filter(Boolean);

  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[1][0] : "";

  return (first + second).toUpperCase();
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3"
      >
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-lg font-semibold tracking-tight ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-accent text-xs font-black text-white"
          >
            F
          </span>
          Feedles
        </Link>

        <Link
          href="/watchlist"
          className={`rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-foreground ${focusRing}`}
        >
          Watchlist
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden items-center gap-2 sm:flex">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 rounded-full ring-1 ring-white/15"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-full bg-white/10 text-xs font-semibold"
                  >
                    {initials(user.name, user.email)}
                  </span>
                )}
                <span className="max-w-40 truncate text-sm text-zinc-300">
                  {user.name ?? user.email}
                </span>
              </span>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className={`rounded-lg border border-white/15 px-3 py-1.5 text-sm transition-colors hover:bg-white/10 ${focusRing}`}
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/signin"
              className={`rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 ${focusRing}`}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
