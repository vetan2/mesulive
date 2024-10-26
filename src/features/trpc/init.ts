import "server-only";
import { initTRPC } from "@trpc/server";
import superJSON from "superjson";

export const createTRPCContext = () => {
  return {};
};

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create({
  transformer: superJSON,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
