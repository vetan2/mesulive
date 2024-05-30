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
        "h-screen w-72 transition-all duration-500 ease-vaul",
        isOpen ? "ml-0" : "ml-[-288px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
