import { type ReactNode } from "react";

import { cx } from "@/_shared/style/utils";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PermanentDrawer = ({ isOpen = true, children, className }: Props) => {
  return <div className={cx("h-screen w-60", !isOpen && "hidden", className)}>{children}</div>;
};
