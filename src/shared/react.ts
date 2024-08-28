import { type Either } from "fp-ts/lib/Either";

import { E } from "./fp";

export const isServer = () => typeof window === "undefined";

export type FormPayload<V, I = string> = {
  input: I;
  value: Either<string, V>;
};

export const createFormPayload = <T>(defaultValue: T): FormPayload<T> => ({
  input: String(defaultValue),
  value: E.right(defaultValue),
});
