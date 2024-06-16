import { type Either } from "fp-ts/lib/Either";
import { match } from "ts-pattern";
import { type ZodType, type ZodError, type ZodSchema } from "zod";

import { E } from "./fp";

export const getFirstZodErrorMessage = (zodError: ZodError) =>
  zodError.errors.at(0)?.message;

export const getZodErrorMessage = (zodType: ZodType) => (value: unknown) =>
  match(zodType.safeParse(value))
    .with({ success: false }, ({ error }) => getFirstZodErrorMessage(error))
    .otherwise(() => undefined);

export const createZodPredicate =
  <Z>(zodSchema: ZodSchema<Z>) =>
  (value: unknown): value is Z =>
    zodSchema.safeParse(value).success;

export const parseZod =
  <Z>(zodSchema: ZodSchema<Z>) =>
  (value: unknown): Either<ZodError<Z>, Z> =>
    match(zodSchema.safeParse(value))
      .with({ success: true }, ({ data }) => E.right(data))
      .with({ success: false }, ({ error }) => E.left(error))
      .exhaustive();
