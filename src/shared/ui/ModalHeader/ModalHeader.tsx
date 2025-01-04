"use client";

import {
  // eslint-disable-next-line no-restricted-imports
  ModalHeader as ModalHeaderOrig,
  type ModalHeaderProps,
} from "@nextui-org/react";

import { cx } from "~/shared/style";

export const ModalHeader = ({ className, ...props }: ModalHeaderProps) => {
  return (
    <ModalHeaderOrig {...props} className={cx("justify-center", className)} />
  );
};
