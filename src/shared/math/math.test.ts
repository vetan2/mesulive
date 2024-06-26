import {
  getCombinations,
  getRepeatPermutations,
  maxFractionDigits,
} from "./utils";

describe("getCombinations", () => {
  test("number", () => {
    expect(getCombinations([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
    ]);
  });
});

describe("getRepeatPermutations", () => {
  test("number", () => {
    expect(getRepeatPermutations([1, 2, 3, 4], 2)).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ]);
  });
});

describe("setMaxFractionDigits", () => {
  test("number", () => {
    expect(maxFractionDigits(2)(12.123456789)).toBe(12.12);
  });
});
