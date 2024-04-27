import { type ReactNode } from "react";

interface Props {
  isOpen?: boolean;
  children?: ReactNode;
}

export const PermanentDrawer = ({ isOpen, children }: Props) => {
  return <div className="h-screen w-60">{children}</div>;
};
