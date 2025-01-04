"use client";

import {
  // eslint-disable-next-line no-restricted-imports
  RadioGroup as RadioGroupOrig,
  type RadioGroupProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

import { cx } from "~/shared/style";

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ classNames, ...props }, ref) => {
    return (
      <RadioGroupOrig
        ref={ref}
        classNames={{
          ...classNames,
          label: cx("font-bold text-default-800", classNames?.label),
        }}
        {...props}
      />
    );
  },
);
