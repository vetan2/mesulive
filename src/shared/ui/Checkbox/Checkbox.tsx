"use client";

import {
  Checkbox as CheckboxOrig,
  type CheckboxProps,
} from "@nextui-org/react";
import { forwardRef } from "react";

import { cx } from "~/shared/style";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ classNames, ...props }, ref) => {
    return (
      <CheckboxOrig
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
