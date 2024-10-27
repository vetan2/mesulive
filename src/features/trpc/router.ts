import "server-only";

import { z } from "zod";

import { potentialRouter } from "~/features/get-potential-data/router";
import { sendLog } from "~/shared/cloudWatchLogs";

import { publicProcedure, router } from "./init";

export const appRouter = router({
  potential: potentialRouter,
  log: publicProcedure.input(z.any()).mutation(({ input }) => sendLog(input)()),
});

export type AppRouter = typeof appRouter;
