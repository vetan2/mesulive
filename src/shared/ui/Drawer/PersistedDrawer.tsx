import { m } from "framer-motion";
import { type ReactNode } from "react";

import { cx } from "~/shared/style";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PersistedDrawer = ({ isOpen = true, children, className }: Props) => {
  return (
    <div>
      <m.div
        className={cx(
          "h-screen w-60 transition-transform lg:w-[280px]",
          isOpen ? "translate-x-0" : "translate-x-[-240px] lg:translate-x-[-280px]",
          className,
        )}
        // animate={{
        //   x: isOpen ? 0 : -240,
        // }}
        // initial={false}
        // transition={drawerTransition}
      >
        {children}
      </m.div>
    </div>
  );
};
