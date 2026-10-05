import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  watchlistFindMany: vi.fn(),
  watchlistFindFirst: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      watchlist: {
        findMany: mocks.watchlistFindMany,
        findFirst: mocks.watchlistFindFirst,
      },
    },
  },
}));

vi.mock("react", () => ({ cache: (fn: unknown) => fn }));

import { getWatchlistEntry, getWatchlistForUser } from "./watchlist";

beforeEach(() => {
  mocks.watchlistFindMany.mockReset();
  mocks.watchlistFindFirst.mockReset();
});

describe("getWatchlistForUser", () => {
  it("returns the user's watchlist", async () => {
    const rows = [{ movieId: 1, watched: false }];
    mocks.watchlistFindMany.mockResolvedValue(rows);

    await expect(getWatchlistForUser("user-1")).resolves.toBe(rows);
    expect(mocks.watchlistFindMany).toHaveBeenCalledTimes(1);
  });
});

describe("getWatchlistEntry", () => {
  it("returns null when there is no entry", async () => {
    mocks.watchlistFindFirst.mockResolvedValue(undefined);
    await expect(getWatchlistEntry("user-1", 99)).resolves.toBeUndefined();
  });

  it("returns the entry when it exists", async () => {
    mocks.watchlistFindFirst.mockResolvedValue({ movieId: 5, watched: true });
    await expect(getWatchlistEntry("user-1", 5)).resolves.toEqual({
      movieId: 5,
      watched: true,
    });
  });
});
