"use client";

import { getOptionResults } from "~/app/calc/potential/_lib/logics";

addEventListener(
  "message",
  (event: MessageEvent<Parameters<typeof getOptionResults>[0]>) => {
    postMessage(getOptionResults(event.data));
  },
);
