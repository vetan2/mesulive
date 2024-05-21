import { type ReactNode } from "react";
import { match } from "ts-pattern";

import { PermanentDrawer } from "./PermanentDrawer";
import { PersistedDrawer } from "./PersistedDrawer";
import { TemporaryDrawer, TemporaryDrawerContent } from "./TemporaryDrawer";

export interface DrawerProps {
  children?: ReactNode;
  variant: "permanent" | "persisted" | "temporary";
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onClose?: () => void;
  className?: string;
}

export const Drawer = ({
  children,
  variant,
  isOpen,
  onOpenChange,
  onClose,
  className,
}: DrawerProps) => {
  return match(variant)
    .with("permanent", () => (
      <PermanentDrawer isOpen={isOpen} className={className}>
        {children}
      </PermanentDrawer>
    ))
    .with("persisted", () => (
      <PersistedDrawer isOpen={isOpen} className={className}>
        {children}
      </PersistedDrawer>
    ))
    .otherwise(() => (
      <TemporaryDrawer open={isOpen} direction="left" onClose={onClose} onOpenChange={onOpenChange}>
        <TemporaryDrawerContent className={className}>{children}</TemporaryDrawerContent>
      </TemporaryDrawer>
    ));
};
