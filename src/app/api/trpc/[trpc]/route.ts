import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "~/features/trpc/init";
import { appRouter } from "~/features/trpc/router";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta: ({ errors, type }) => {
      if (errors.length === 0 && type === "query") {
        return {
          headers: new Headers([
            [
              "cache-control",
              `public, max-age=${14 * 60 * 60 * 24} s-maxage=1, stale-while-revalidate=${60 * 60 * 24}`,
            ],
          ]),
        };
      }

      return {};
    },
  });

export { handler as GET, handler as POST };
