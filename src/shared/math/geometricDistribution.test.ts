import { pipe } from "fp-ts/function";

import { O } from "~/shared/fp";

import {
  getCostFromTopPct,
  getTopPctFromCost,
  TopPctCost,
} from "./geometricDistribution";

describe("getCostFromTopPct", () => {
  test("valid input", () => {
    const inputArr: [number, number, number][] = [[0.01, 75, 138]];
    inputArr.forEach(([probability, topPct, result]) =>
      expect(
        pipe(
          getCostFromTopPct(probability)(topPct),
          O.fromNullable,
          O.filter((v) => Math.abs(v - result) < 1),
          O.toUndefined,
        ),
      ).toBeTruthy(),
    );
  });
});

describe("getTopPctFromCost", () => {
  test("valid input", () => {
    const inputArr: [number, number, number][] = [[0.01, 138, 75]];
    inputArr.forEach(([probability, cost, result]) =>
      expect(
        pipe(
          getTopPctFromCost(probability)(cost),
          O.fromNullable,
          O.filter((v) => Math.abs(v - result) < 1),
          O.toUndefined,
        ),
      ).toBeTruthy(),
    );
  });
});

describe("TopPctCost", () => {
  it("Bernoulli trial with ceil", () => {
    const topPctCost = new TopPctCost({
      type: "Bernoulli",
      probability: 0.01,
      ceil: 100,
    });

    expect(Math.floor(topPctCost.meanCost ?? 0)).toBe(63);
    expect(Math.floor(topPctCost.meanTopPct ?? 0)).toBe(46);
    // n = 99에서 누적확률 : 63.03%
    expect(Math.floor(topPctCost.getCostFromTopPct(75) ?? 0)).toBe(100);
    expect(topPctCost.getTopPctFromCost(100)).toBe(1);

    // Edge case
    expect(topPctCost.getCostFromTopPct(100)).toBe(100);
    expect(topPctCost.getCostFromTopPct(Infinity)).toBe(100);
    expect(topPctCost.getCostFromTopPct(0)).toBe(undefined);

    expect(topPctCost.getTopPctFromCost(0)).toBe(undefined);
    expect(topPctCost.getTopPctFromCost(Infinity)).toBe(100);
  });

  it("Bernoulli trial without ceil", () => {
    const topPctCost = new TopPctCost({ type: "Bernoulli", probability: 0.01 });

    expect(topPctCost.meanCost).toBe(100);
    expect(topPctCost.meanTopPct).toBe(
      getTopPctFromCost(0.01)(topPctCost.meanCost ?? -1),
    );
    expect(
      pipe(
        topPctCost.getCostFromTopPct(75),
        O.fromNullable,
        O.filter((v) => Math.abs(138 - v) < 1),
        O.match(
          () => false,
          () => true,
        ),
      ),
    ).toBeTruthy();
    expect(topPctCost.getTopPctFromCost(138)).toBe(
      getTopPctFromCost(0.01)(138),
    );

    // Edge case
    expect(topPctCost.getCostFromTopPct(100)).toBe(undefined);
    expect(topPctCost.getCostFromTopPct(Infinity)).toBe(undefined);
    expect(topPctCost.getCostFromTopPct(0)).toBe(undefined);

    expect(topPctCost.getTopPctFromCost(0)).toBe(undefined);
    expect(topPctCost.getTopPctFromCost(Infinity)).toBe(100);
  });

  it("data", () => {
    const topPctCost = new TopPctCost({
      type: "data",
      samples: [1, 2, 3, 4, 5],
    });

    expect(topPctCost.meanCost).toBe(3);
    expect(topPctCost.meanTopPct).toBe(60);
    expect(topPctCost.getCostFromTopPct(60)).toBe(3);
    expect(topPctCost.getTopPctFromCost(5)).toBe(100);

    // Edge case
    expect(topPctCost.getCostFromTopPct(101)).toBe(undefined);
    expect(topPctCost.getCostFromTopPct(Infinity)).toBe(undefined);
    expect(topPctCost.getCostFromTopPct(0)).toBe(undefined);

    expect(topPctCost.getTopPctFromCost(0)).toBe(undefined);
    expect(topPctCost.getTopPctFromCost(1)).toBe(20);
    expect(topPctCost.getTopPctFromCost(Infinity)).toBe(100);
  });
});
