import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

const emailProvider = Nodemailer({
  // Without a real SMTP server configured, we log the magic link instead.
  server: process.env.EMAIL_SERVER ?? {
    host: "localhost",
    port: 1025,
    auth: { user: "", pass: "" },
  },
  from: process.env.EMAIL_FROM ?? "CineShelf <no-reply@cineshelf.local>",
  async sendVerificationRequest({ identifier, url, provider }) {
    if (!process.env.EMAIL_SERVER) {
      console.log(
        `\n  Magic sign-in link for ${identifier}:\n  ${url}\n`,
      );
      return;
    }

    const transport = createTransport(provider.server);
    const result = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: "Sign in to CineShelf",
      text: `Sign in to CineShelf\n\n${url}\n`,
      html: `<p>Sign in to CineShelf</p><p><a href="${url}">Click here to sign in</a></p>`,
    });

    const failed = [...result.rejected, ...(result.pending ?? [])].filter(
      Boolean,
    );
    if (failed.length > 0) {
      throw new Error(`Could not send email to: ${failed.join(", ")}`);
    }
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    ...(process.env.AUTH_GITHUB_ID ? [GitHub] : []),
    ...(process.env.AUTH_GOOGLE_ID ? [Google] : []),
    emailProvider,
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify",
  },
  trustHost: true,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
