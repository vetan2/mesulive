import { type ReactNode } from "react";
import { match } from "ts-pattern";

import { cx } from "~/shared/style";

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
        <TemporaryDrawerContent className={cx("flex flex-row", className)}>
          <div className="flex-1">{children}</div>
          <div className="mx-4 my-auto h-12 w-1.5 flex-shrink-0 rounded-full bg-zinc-300 md:hidden" />
        </TemporaryDrawerContent>
      </TemporaryDrawer>
    ));
};
