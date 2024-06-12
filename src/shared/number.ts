import { pipe } from "fp-ts/lib/function";

import { O } from "./fp";

export const isNumeric = (value: unknown): value is `${number}` => {
  if (typeof value != "string") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !isNaN(value as any) && !isNaN(parseFloat(value));
};

export const convertToNumber = (value: unknown) =>
  pipe(value, O.fromPredicate(isNumeric), O.map(parseFloat));
