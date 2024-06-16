import { isNumeric, putUnit } from "./number";

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

describe("putUnit()", () => {
  test("number", () => {
    expect(putUnit(0)).toBe("0");
    expect(putUnit(12345678)).toBe("1234만 5678");
    expect(putUnit(12340678)).toBe("1234만 678");
    expect(putUnit(100001234)).toBe("1억 1234");
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(putUnit(12345678876543210123)).toBe("약 1234경 5678조");
  });
});
