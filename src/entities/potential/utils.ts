import { P, match } from "ts-pattern";

import {
  gradesEnableToPromote,
  gradesEnableToReset,
  type AimType,
  type Grade,
  type ResetMethod,
  type Type,
} from "./constants";

export const flattenLevel = (level: number) => {
  if (level === 0) return 0;
  return (Math.floor((level - 1) / 10) + 1) * 10;
};

export const getIsResetMethodEnable = (params: {
  aimType: AimType;
  resetMethod: ResetMethod;
  grade: Grade;
  type: Type;
}) =>
  match(params)
    .with(
      {
        type: "ADDI",
        resetMethod: P.not(P.union("ADDI", "ADDI_POTENTIAL", "STRANGE_ADDI")),
      },
      () => false,
    )
    .with(
      {
        type: "COMMON",
        resetMethod: P.union("ADDI", "ADDI_POTENTIAL", "STRANGE_ADDI"),
      },
      () => false,
    )
    .with({ aimType: "GRADE_UP" }, ({ resetMethod, grade }) =>
      gradesEnableToPromote[resetMethod].includes(grade),
    )
    .with({ aimType: "OPTIONS" }, ({ resetMethod, grade }) =>
      gradesEnableToReset[resetMethod].includes(grade),
    )
    .otherwise(() => false);
