"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superJSON from "superjson";

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
    httpBatchLink({
      transformer: superJSON,
      url: getUrl(),
    }),
  ],
});
