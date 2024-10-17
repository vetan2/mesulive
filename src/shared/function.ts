import { identity } from "fp-ts";
import { chainFirstIOK as _chainFirstIOK } from "fp-ts/lib/FromIO";
import { type TaskEither } from "fp-ts/lib/TaskEither";

import { E } from "./fp";

export const loggingIdentity =
  (tag: string) =>
  <T>(arg: T): T => {
    // eslint-disable-next-line no-console
    console.log(tag, arg);
    return arg;
  };

export const taskEitherToPromise = <E, A>(
  taskEither: TaskEither<E, A>,
): Promise<A> => {
  return taskEither().then(
    E.fold(
      (e) => Promise.reject(e),
      (a) => Promise.resolve(a),
    ),
  );
};

export const taskEitherKToPromise = <E, A extends readonly unknown[], B>(
  f: (...a: A) => TaskEither<E, B>,
  a: A,
): Promise<B> => {
  return taskEitherToPromise(f(...a));
};

export const chainFirstIOK = _chainFirstIOK(
  {
    URI: identity.URI,
    fromIO: (ioa) => ioa(),
  },
  identity.Chain,
);

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// recursively
type AllNullToUndefined<T extends object> = {
  [K in keyof T]: null extends T[K]
    ? NonNullable<T[K]> | undefined
    : T[K] extends object
      ? AllNullToUndefined<T[K]>
      : T[K];
};

/**
 * Use only for object whose values are all json parsable value
 */
export const convertAllNullToUndefined = <T extends object>(
  data: T,
): AllNullToUndefined<T> => {
  if (Array.isArray(data)) {
    return data.map(
      convertAllNullToUndefined,
    ) as unknown as AllNullToUndefined<T>; // 배열의 각 요소를 재귀적으로 처리
  } else if (data !== null && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        convertAllNullToUndefined(value),
      ]),
    ) as AllNullToUndefined<T>;
  } else {
    return (data === null
      ? undefined
      : data) as unknown as AllNullToUndefined<T>; // null일 경우 undefined로 변환
  }
};
