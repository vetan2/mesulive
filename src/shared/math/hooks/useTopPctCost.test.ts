import { renderHook } from "@testing-library/react";
import { pipe } from "fp-ts/function";

import { O } from "~/shared/fp";
import { GD } from "~/shared/math";

import { useTopPctCost } from "./useTopPctCost";

describe("useTopPctCost", () => {
  it("Bernoulli trial", () => {
    const {
      result: {
        current: { meanCost, meanTopPct, getCostFromTopPct, getTopPctFromCost },
      },
    } = renderHook(() =>
      useTopPctCost({ type: "Bernoulli", probability: 0.01 }),
    );

    expect(meanCost).toBe(100);
    expect(meanTopPct).toBe(GD.getTopPctFromCost(0.01)(meanCost ?? -1));
    expect(
      pipe(
        getCostFromTopPct(75),
        O.fromNullable,
        O.filter((v) => Math.abs(138 - v) < 1),
        O.match(
          () => false,
          () => true,
        ),
      ),
    ).toBeTruthy();
    expect(getTopPctFromCost(138)).toBe(GD.getTopPctFromCost(0.01)(138));

    // Edge case
    expect(getCostFromTopPct(100)).toBe(undefined);
    expect(getCostFromTopPct(Infinity)).toBe(undefined);
    expect(getCostFromTopPct(0)).toBe(undefined);

    expect(getTopPctFromCost(0)).toBe(undefined);
    expect(getTopPctFromCost(Infinity)).toBe(100);
  });

  it("data", () => {
    const {
      result: {
        current: { meanCost, meanTopPct, getCostFromTopPct, getTopPctFromCost },
      },
    } = renderHook(() =>
      useTopPctCost({ type: "data", samples: [1, 2, 3, 4, 5] }),
    );
    expect(meanCost).toBe(3);
    expect(meanTopPct).toBe(60);
    expect(getCostFromTopPct(60)).toBe(3);
    expect(getTopPctFromCost(5)).toBe(100);

    // Edge case
    expect(getCostFromTopPct(101)).toBe(undefined);
    expect(getCostFromTopPct(Infinity)).toBe(undefined);
    expect(getCostFromTopPct(0)).toBe(undefined);

    expect(getTopPctFromCost(0)).toBe(undefined);
    expect(getTopPctFromCost(1)).toBe(20);
    expect(getTopPctFromCost(Infinity)).toBe(100);
  });
});
