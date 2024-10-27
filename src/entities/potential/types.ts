import { z } from "zod";

import { possibleStatsSchema } from "./constants";

export const optionSetSchema = z.record(possibleStatsSchema, z.number());
export type OptionSet = z.infer<typeof optionSetSchema>;
