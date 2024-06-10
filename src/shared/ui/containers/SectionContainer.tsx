import { type ReactNode, forwardRef, type HTMLAttributes } from "react";

import { cx } from "~/shared/style";

export const SectionContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    title?: ReactNode;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <section
      className={cx("rounded-3xl bg-white p-4 shadow-section", className)}
      ref={ref}
      {...props}
    >
      {title && (
        <h2 className="text-base font-bold text-primary lg:text-lg">{title}</h2>
      )}
      {children}
    </section>
  );
});
