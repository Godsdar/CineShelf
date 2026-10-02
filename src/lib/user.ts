import { cache } from "react";
import { auth } from "@/auth";

/**
 * The signed-in user for the current request, or null. Safe to call from any
 * Server Component; memoized per request.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});
