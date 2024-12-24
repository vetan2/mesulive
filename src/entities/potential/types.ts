import { type Option } from "fp-ts/lib/Option";
import { z } from "zod";

import { type FormPayload } from "~/shared/react";

import { type PossibleStat, possibleStatsSchema } from "./constants";

export const optionSetSchema = z.record(possibleStatsSchema, z.number());
export type OptionSet = z.infer<typeof optionSetSchema>;

export type OptionSetForm = {
  stat: Option<PossibleStat>;
  figure: FormPayload<number>;
}[][];

export type RefinedOptionSetForm = {
  stat: PossibleStat;
  figure: number;
}[][];
