import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { getAllowedEmails } from "./utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: ({ profile }) => {
      if (!profile?.email) return false;

      return getAllowedEmails().includes(profile.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: process.env.NODE_ENV === "production",
});
