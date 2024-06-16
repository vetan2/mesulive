export const loggingIdentity =
  (tag: string) =>
  <T>(arg: T): T => {
    // eslint-disable-next-line no-console
    console.log(tag, arg);
    return arg;
  };
