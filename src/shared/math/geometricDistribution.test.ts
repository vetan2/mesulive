import { pipe } from "fp-ts/function";

import { O } from "~/shared/fp";

import { GD } from ".";

describe("getCostFromTopPct", () => {
  test("valid input", () => {
    const inputArr: [number, number, number][] = [[0.01, 75, 138]];
    inputArr.forEach(([probability, topPct, result]) =>
      expect(
        pipe(
          GD.getCostFromTopPct(probability)(topPct),
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
          GD.getTopPctFromCost(probability)(cost),
          O.fromNullable,
          O.filter((v) => Math.abs(v - result) < 1),
          O.toUndefined,
        ),
      ).toBeTruthy(),
    );
  });
});
