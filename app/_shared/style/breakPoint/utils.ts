import { breakPoints } from "./constants";

export const getBreakPoints = (screenWidth: number) => {
  if (screenWidth >= breakPoints.md) {
    return "md";
  }

  if (screenWidth >= breakPoints.lg) {
    return "lg";
  }

  if (screenWidth >= breakPoints.xl) {
    return "xl";
  }

  return "sm";
};
