"use client";

import { P, match } from "ts-pattern";

import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { Drawer } from "~/shared/ui/Drawer";

import { SidebarContent } from "./SidebarContent";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, onOpenChange }: Props) => {
  const breakPoint = useBreakPoint({ initializeWithValue: false });

  console.log((breakPoint ?? -Infinity) >= BreakPoint.md && isOpen);

  return (
    <>
      <Drawer
        variant="temporary"
        isOpen={breakPoint === BreakPoint.sm && isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          onOpenChange(false);
        }}
        className="h-full w-60 bg-white md:hidden"
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="persisted"
        isOpen={match(breakPoint)
          .with(P.nullish, () => false)
          .otherwise(() => isOpen)}
        onOpenChange={onOpenChange}
        onClose={() => {
          onOpenChange(false);
        }}
        className="hidden h-full w-60 bg-white md:max-lg:block"
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="persisted"
        isOpen={match(breakPoint)
          .with(P.nullish, () => true)
          .otherwise((breakPoint) => breakPoint >= BreakPoint.lg && isOpen)}
        onOpenChange={onOpenChange}
        onClose={() => {
          onOpenChange(false);
        }}
        className="hidden h-full w-[280px] bg-white lg:block"
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};
