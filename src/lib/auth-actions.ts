"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/watchlist" });
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/watchlist" });
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return;
  }

  await signIn("nodemailer", { email, redirectTo: "/watchlist" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
