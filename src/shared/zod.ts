import { type Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import {
  type ZodType,
  type ZodError,
  type ZodSchema,
  type ZodTypeDef,
} from "zod";

import { E, O } from "./fp";

export const getFirstZodErrorMessage = (zodError: ZodError) =>
  O.fromNullable(zodError.errors.at(0)?.message);

export const getZodErrorMessage = (zodType: ZodType) => (value: unknown) =>
  match(zodType.safeParse(value))
    .with({ success: false }, ({ error }) => getFirstZodErrorMessage(error))
    .otherwise(() => O.none);

export const createZodPredicate =
  <Z>(zodSchema: ZodSchema<Z>) =>
  (value: unknown): value is Z =>
    zodSchema.safeParse(value).success;

export const parseZod =
  <Output, Def extends ZodTypeDef, Input>(
    zodSchema: ZodType<Output, Def, Input>,
  ) =>
  (value: unknown): Either<ZodError<Input>, Output> =>
    match(zodSchema.safeParse(value))
      .with({ success: true }, ({ data }) => E.right(data))
      .with({ success: false }, ({ error }) => E.left(error))
      .exhaustive();

export const parseZodWithErrorMessage =
  <Z>(zodSchema: ZodSchema<Z>) =>
  (value: unknown) =>
    pipe(
      value,
      parseZod(zodSchema),
      E.mapLeft(
        flow(
          getFirstZodErrorMessage,
          O.getOrElse(() => "올바르지 않은 값입니다."),
        ),
      ),
    );
