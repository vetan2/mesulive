import { type HTMLAttributes } from "react";

import { cx } from "~/shared/style";

export const SectionContainer = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx("rounded-3xl bg-white p-4 shadow-section", className)}
      {...props}
    />
  );
};
