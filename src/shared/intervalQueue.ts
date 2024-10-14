import { delay } from "./function";

export class IntervalQueue {
  private currentPromise: Promise<unknown> = Promise.resolve();
  private interval: number;

  constructor(minInterval: number) {
    this.interval = minInterval;
  }

  enqueue<T>(promiseFunction: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const processNext = async () => {
        await promiseFunction().then(resolve);
      };
      this.currentPromise = this.currentPromise
        .then(processNext)
        .catch(reject)
        .then(() => delay(this.interval));
    });
  }
}
