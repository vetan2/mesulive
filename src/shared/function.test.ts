import { convertAllNullToUndefined } from "./function";

describe("convertAllNullToUndefined", () => {
  it("should convert all null to undefined", () => {
    expect(convertAllNullToUndefined({ a: null, b: 1 })).toEqual({
      a: undefined,
      b: 1,
    });

    expect(
      convertAllNullToUndefined({ a: null, b: { c: null, d: 1 } }),
    ).toEqual({
      a: undefined,
      b: { c: undefined, d: 1 },
    });

    expect(
      convertAllNullToUndefined({
        a: null,
        b: [1, null, { c: null, d: 1 }, { e: 2 }],
      }),
    ).toEqual({
      a: undefined,
      b: [1, undefined, { c: undefined, d: 1 }, { e: 2 }],
    });
  });

  it("should convert complex object null to undefined", () => {
    expect(
      convertAllNullToUndefined({
        a: null,
        b: {
          c: null,
          d: {
            e: null,
            f: [1, null, { g: null, h: 2 }, { i: 3 }],
          },
        },
      }),
    ).toEqual({
      a: undefined,
      b: {
        c: undefined,
        d: {
          e: undefined,
          f: [1, undefined, { g: undefined, h: 2 }, { i: 3 }],
        },
      },
    });

    expect(convertAllNullToUndefined([[null], [1, null]])).toEqual([
      [undefined],
      [1, undefined],
    ]);
  });
});
