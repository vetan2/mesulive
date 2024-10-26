import "server-only"; // <-- ensure this file cannot be imported from the client

import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./router";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const trpc = createCallerFactory(appRouter)(createTRPCContext);
