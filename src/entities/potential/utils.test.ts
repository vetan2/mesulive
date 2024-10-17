import { O } from "~/shared/fp";

import { flattenLevel, getIsResetMethodEnable } from "./utils";

describe("flattenLevel", () => {
  it("should return valid result", () => {
    expect(flattenLevel(-1)).toEqual(O.none);
    expect(flattenLevel(0)).toEqual(O.some(9));
    expect(flattenLevel(1)).toEqual(O.some(9));
    expect(flattenLevel(10)).toEqual(O.some(10));
    expect(flattenLevel(11)).toEqual(O.some(19));
    expect(flattenLevel(120)).toEqual(O.some(200));
    expect(flattenLevel(200)).toEqual(O.some(200));
    expect(flattenLevel(201)).toEqual(O.some(250));
    expect(flattenLevel(250)).toEqual(O.some(250));
    expect(flattenLevel(251)).toEqual(O.none);
  });
});

describe("getIsResetMethodEnable", () => {
  it("should return valid result if type is ADDI", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "RARE",
        type: "ADDI",
      }),
    ).toBe(false);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "ADDI",
        grade: "RARE",
        type: "ADDI",
      }),
    ).toBe(true);
  });

  it("should return valid result if type is COMMON", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "ADDI",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(false);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(true);
  });

  it("should return valid result if aimType is GRADE_UP", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "EPIC",
        type: "COMMON",
      }),
    ).toBe(true);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "STRANGE",
        grade: "EPIC",
        type: "COMMON",
      }),
    ).toBe(false);
  });

  it("should return valid result if aimType is OPTIONS", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "OPTIONS",
        resetMethod: "RED",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(true);

    expect(
      getIsResetMethodEnable({
        aimType: "OPTIONS",
        resetMethod: "STRANGE",
        grade: "UNIQUE",
        type: "COMMON",
      }),
    ).toBe(false);
  });
});
