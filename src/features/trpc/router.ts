import "server-only";

import { potentialRouter } from "~/features/get-potential-data/router";

import { router } from "./init";

export const appRouter = router({
  potential: potentialRouter,
});

export type AppRouter = typeof appRouter;
