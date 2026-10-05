import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  movieFindMany: vi.fn(),
  movieFindFirst: vi.fn(),
  genreFindMany: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      movies: {
        findMany: mocks.movieFindMany,
        findFirst: mocks.movieFindFirst,
      },
      genres: { findMany: mocks.genreFindMany },
    },
  },
}));

vi.mock("react", () => ({ cache: (fn: unknown) => fn }));

import {
  getGenres,
  getMovieById,
  getMovies,
  getRelatedMovies,
  searchMovies,
} from "./movies";

beforeEach(() => {
  mocks.movieFindMany.mockReset();
  mocks.movieFindFirst.mockReset();
  mocks.genreFindMany.mockReset();
});

describe("getMovies", () => {
  it("returns the rows and uses default paging", async () => {
    const rows = [{ id: 1, title: "Dune" }];
    mocks.movieFindMany.mockResolvedValue(rows);

    await expect(getMovies()).resolves.toBe(rows);

    const arg = mocks.movieFindMany.mock.calls[0][0];
    expect(arg.limit).toBe(24);
    expect(arg.offset).toBe(0);
    expect(Array.isArray(arg.orderBy)).toBe(true);
  });

  it("honours custom limit and offset", async () => {
    mocks.movieFindMany.mockResolvedValue([]);
    await getMovies(5, 10);
    const arg = mocks.movieFindMany.mock.calls[0][0];
    expect(arg.limit).toBe(5);
    expect(arg.offset).toBe(10);
  });
});

describe("getMovieById", () => {
  it("returns the first matching row", async () => {
    mocks.movieFindFirst.mockResolvedValue({ id: 7 });
    await expect(getMovieById(7)).resolves.toEqual({ id: 7 });
    expect(mocks.movieFindFirst).toHaveBeenCalledTimes(1);
  });
});

describe("searchMovies", () => {
  it("passes no where clause when there are no filters", async () => {
    mocks.movieFindMany.mockResolvedValue([]);
    await searchMovies({});
    expect(mocks.movieFindMany.mock.calls[0][0].where).toBeUndefined();
  });

  it("builds a where clause for a text query", async () => {
    mocks.movieFindMany.mockResolvedValue([]);
    await searchMovies({ q: "dune" });
    expect(mocks.movieFindMany.mock.calls[0][0].where).toBeDefined();
  });

  it("builds a where clause for a genre filter", async () => {
    mocks.movieFindMany.mockResolvedValue([]);
    await searchMovies({ genreId: 3 });
    expect(mocks.movieFindMany.mock.calls[0][0].where).toBeDefined();
  });
});

describe("getRelatedMovies", () => {
  it("returns related rows", async () => {
    mocks.movieFindMany.mockResolvedValue([{ id: 2 }]);
    await expect(getRelatedMovies(1)).resolves.toEqual([{ id: 2 }]);
  });
});

describe("getGenres", () => {
  it("returns genres", async () => {
    mocks.genreFindMany.mockResolvedValue([{ id: 1, name: "Drama" }]);
    await expect(getGenres()).resolves.toEqual([{ id: 1, name: "Drama" }]);
  });
});
