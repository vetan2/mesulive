"use client";

// eslint-disable-next-line no-restricted-imports
import { Select as SelectOrig, type SelectProps } from "@nextui-org/react";
import { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ classNames, ...props }, ref) => {
    return (
      <SelectOrig
        ref={ref}
        scrollShadowProps={{
          hideScrollBar: false,
          ...props.scrollShadowProps,
        }}
        {...props}
      />
    );
  },
);
