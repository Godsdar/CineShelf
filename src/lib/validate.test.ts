import { describe, expect, it } from "vitest";
import { parseMovieId } from "./validate";

function form(movieId?: string): FormData {
  const fd = new FormData();
  if (movieId !== undefined) {
    fd.set("movieId", movieId);
  }
  return fd;
}

describe("parseMovieId", () => {
  it("returns a positive integer", () => {
    expect(parseMovieId(form("5"))).toBe(5);
    expect(parseMovieId(form("42"))).toBe(42);
  });

  it("throws when movieId is missing", () => {
    expect(() => parseMovieId(form())).toThrow("Invalid movie id");
    expect(() => parseMovieId(form(""))).toThrow("Invalid movie id");
  });

  it("throws for zero and negative values", () => {
    expect(() => parseMovieId(form("0"))).toThrow("Invalid movie id");
    expect(() => parseMovieId(form("-3"))).toThrow("Invalid movie id");
  });

  it("throws for non-integers and non-numeric strings", () => {
    expect(() => parseMovieId(form("3.5"))).toThrow("Invalid movie id");
    expect(() => parseMovieId(form("abc"))).toThrow("Invalid movie id");
  });
});
