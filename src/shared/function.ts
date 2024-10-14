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

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
