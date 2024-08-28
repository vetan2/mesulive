import { getIsResetMethodEnable } from "./utils";

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
