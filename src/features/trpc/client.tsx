"use client";

import { createTRPCClient, httpLink } from "@trpc/client";

import { type AppRouter } from "./router";

const getUrl = () => {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      // transformer: superJSON,
      url: getUrl(),
    }),
  ],
});
