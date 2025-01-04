"use client";

// eslint-disable-next-line no-restricted-imports
import { Radio as RadioOrig, type RadioProps } from "@nextui-org/react";
import { forwardRef } from "react";

import { cx } from "~/shared/style";

export const Radio = forwardRef<HTMLElement, RadioProps>(
  ({ classNames, ...props }, ref) => {
    return (
      <RadioOrig
        ref={ref}
        classNames={{
          ...classNames,
          label: cx(
            "text-default-600",
            "group-data-[selected=true]:text-primary",
            classNames?.label,
          ),
        }}
        {...props}
      />
    );
  },
);
