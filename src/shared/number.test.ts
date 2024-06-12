import { isNumeric } from "./number";

describe("isNumeric", () => {
  it("should return true for numeric strings", () => {
    expect(isNumeric("0")).toBe(true);
    expect(isNumeric("1")).toBe(true);
    expect(isNumeric("1.1")).toBe(true);
    expect(isNumeric("1.1e1")).toBe(true);
    expect(isNumeric("1.1e-1")).toBe(true);
    expect(isNumeric("1.1e+1")).toBe(true);
  });

  it("should return false for non-numeric strings", () => {
    expect(isNumeric("")).toBe(false);
    expect(isNumeric(" ")).toBe(false);
    expect(isNumeric("a")).toBe(false);
    expect(isNumeric("1a")).toBe(false);
    expect(isNumeric("1.1.1")).toBe(false);
    expect(isNumeric("1.1e1.1")).toBe(false);
  });
});
