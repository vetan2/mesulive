import { breakPoints } from "./constants";
import { BreakPoint } from "./types";

export const getBreakPoints = (screenWidth: number) => {
  if (screenWidth >= breakPoints[BreakPoint.xl]) {
    return BreakPoint.xl;
  }

  if (screenWidth >= breakPoints[BreakPoint.lg]) {
    return BreakPoint.lg;
  }

  if (screenWidth >= breakPoints[BreakPoint.md]) {
    return BreakPoint.md;
  }

  return BreakPoint.sm;
};
