import { match } from "ts-pattern";
import { type ZodType, type ZodError } from "zod";

export const getFirstZodErrorMessage = (zodError: ZodError) =>
  zodError.errors.at(0)?.message;

export const getZodErrorMessage = (zodType: ZodType) => (value: unknown) =>
  match(zodType.safeParse(value))
    .with({ success: false }, ({ error }) => getFirstZodErrorMessage(error))
    .otherwise(() => undefined);
