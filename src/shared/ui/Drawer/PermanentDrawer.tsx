import { type ReactNode } from "react";

import { cx } from "~/shared/style";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PermanentDrawer = ({ isOpen = true, children, className }: Props) => {
  return <div className={cx("h-screen w-72", !isOpen && "hidden", className)}>{children}</div>;
};
