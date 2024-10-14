import { delay } from "./function";
import { IntervalQueue } from "./IntervalQueue";

describe("IntervalQueue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should process promises in order", async () => {
    const queue = new IntervalQueue(1000);
    const results: number[] = [];

    queue.enqueue(async () => {
      results.push(1);
    });

    queue.enqueue(async () => {
      results.push(2);
    });

    const p3 = queue.enqueue(async () => {
      results.push(3);
    });

    await vi.runAllTimersAsync();
    await p3;

    expect(results).toEqual([1, 2, 3]);
  });

  it("should wait for minimum interval between promises", async () => {
    vi.useFakeTimers(); // 타이머를 모킹합니다.

    const minInterval = 1000;
    const queue = new IntervalQueue(minInterval);

    const fn1 = vi.fn();
    const fn2 = vi.fn();

    queue.enqueue(() => delay(2000).then(fn1));

    queue.enqueue(async () => {
      fn2();
    });

    await vi.advanceTimersByTimeAsync(2000);
    expect(fn1).toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(minInterval / 2);
    await expect(fn2).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(minInterval / 2);
    await expect(fn2).toHaveBeenCalled();
  });

  it("should handle promise rejection without stopping the queue", async () => {
    const queue = new IntervalQueue(100);
    const fn = vi.fn();

    const catchFn = vi.fn();
    queue
      .enqueue(() =>
        delay(50).then(() => {
          throw new Error("Test error");
        }),
      )
      .catch(() => {
        catchFn();
      });

    queue.enqueue(() =>
      delay(50).then(() => {
        fn();
      }),
    );

    await vi.advanceTimersByTimeAsync(50);
    await expect(catchFn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    await expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(500);
    await expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should resolve enqueue promise after the queue is completed", async () => {
    const queue = new IntervalQueue(100);
    const fn = vi.fn();

    queue.enqueue(() => delay(50));
    queue.enqueue(() =>
      delay(50).then(() => {
        fn();
      }),
    );

    await vi.advanceTimersByTimeAsync(200);

    expect(fn).toHaveBeenCalled();
  });
});
