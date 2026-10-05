/**
 * Reads `movieId` from a submitted FormData and returns it as a positive
 * integer. Server Actions are public POST endpoints, so every value that
 * arrives from the client is treated as untrusted and validated here.
 */
export function parseMovieId(formData: FormData): number {
  const id = Number(formData.get("movieId"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid movie id");
  }

  return id;
}
