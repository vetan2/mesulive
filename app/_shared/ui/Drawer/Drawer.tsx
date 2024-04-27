import { type ReactNode } from "react";
import { match } from "ts-pattern";

import { PermanentDrawer } from "./PermanentDrawer";

export interface DrawerProps {
  children?: ReactNode;
  variant: "permanent" | "persisted" | "temporary";
  isOpen?: boolean;
}

export const Drawer = ({ children, variant, isOpen }: DrawerProps) => {
  return match(variant)
    .with("permanent", () => <PermanentDrawer isOpen={isOpen}>{children}</PermanentDrawer>)
    .otherwise(() => <div className="h-screen">{children}</div>);
};
