import { z } from "zod";

import { optionSchema } from "./constants";

export const optionTableSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);
export type OptionTable = z.infer<typeof optionTableSchema>;

export const optionTableRecordSchema = z
  .record(optionSchema, optionTableSchema)
  .refine((v): v is Required<typeof v> =>
    optionSchema.options.every(
      (option) => option in v && optionTableSchema.safeParse(v[option]).success,
    ),
  );
export type OptionTableRecord = z.infer<typeof optionTableRecordSchema>;
