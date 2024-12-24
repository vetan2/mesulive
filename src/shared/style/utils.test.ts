import { mergeClassNames } from "./utils";

describe("mergeClassNames", () => {
  it("should merge class names", () => {
    expect(mergeClassNames({ a: "a" }, { a: "b" })).toEqual({ a: "a b" });
    expect(mergeClassNames({ a: "a" }, { a: "b" }, { a: "c" })).toEqual({
      a: "a b c",
    });
    expect(mergeClassNames({ a: "a" }, { b: "b" })).toEqual({ a: "a", b: "b" });
  });
});
