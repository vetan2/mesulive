import { type SlotsToClasses } from "@nextui-org/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { entries } from "~/shared/object";

export const cx = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const mergeClassNames = <T extends string>(
  ...inputs: (SlotsToClasses<T> | undefined)[]
): SlotsToClasses<T> =>
  inputs
    .filter((v): v is NonNullable<typeof v> => v != null)
    .reduce(
      (acc, obj) =>
        entries(obj).reduce(
          (objAcc, [key, value]) => ({
            ...objAcc,
            [key]: cx(objAcc[key], value),
          }),
          acc,
        ),
      {} as SlotsToClasses<T>,
    );
