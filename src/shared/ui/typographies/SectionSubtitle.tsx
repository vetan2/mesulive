import { type HTMLAttributes, forwardRef } from "react";

import { cx } from "~/shared/style";

export const SectionSubtitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...restProps }, ref) => {
  return (
    <h3
      ref={ref}
      className={cx("font-bold text-default-800", className)}
      {...restProps}
    />
  );
});
