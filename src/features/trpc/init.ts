import "server-only";
import { initTRPC } from "@trpc/server";
import superJSON from "superjson";
import { z } from "zod";

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
export const loggingProcedure = t.procedure.input(
  z.object({ logVersion: z.string().default("v3") }),
);
export const createCallerFactory = t.createCallerFactory;
