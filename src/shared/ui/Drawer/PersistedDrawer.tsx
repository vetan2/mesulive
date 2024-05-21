import { type ReactNode } from "react";

import { cx } from "~/shared/style";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PersistedDrawer = ({ isOpen = true, children, className }: Props) => {
  return (
    <div
      className={cx(
        "h-screen w-60 transition-all duration-500 ease-vaul lg:w-[280px]",
        isOpen ? "ml-0" : "ml-[-240px] lg:ml-[-280px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
