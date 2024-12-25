import "server-only";

import { type inferRouterOutputs, type inferRouterInputs } from "@trpc/server";

import { potentialRouter } from "~/features/get-potential-data/router";

import { router } from "./init";

export const appRouter = router({
  potential: potentialRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;

export type RouterOutput = inferRouterOutputs<AppRouter>;
