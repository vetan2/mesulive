"use client";

import { useAtom } from "jotai";
import { useLayoutEffect, useRef } from "react";
import { P, match } from "ts-pattern";

import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { Drawer } from "~/shared/ui/Drawer";

import { sidebarAtoms } from "./atoms";
import { SidebarContent } from "./SidebarContent";

export const Sidebar = () => {
  const breakPoint = useBreakPoint({ initializeWithValue: false });
  const [isOpen, setIsOpen] = useAtom(sidebarAtoms.isOpen);
  const prevBreakPoint = useRef<BreakPoint | undefined>(undefined);

  useLayoutEffect(() => {
    setIsOpen((prev) =>
      match({ breakPoint, prevBreakPoint: prevBreakPoint.current })
        .with(
          {
            breakPoint: P.union(BreakPoint.sm, BreakPoint.md),
          },
          () => false,
        )
        .with(
          {
            breakPoint: P.union(BreakPoint.lg, BreakPoint.xl),
            prevBreakPoint: P.union(BreakPoint.sm, BreakPoint.md, P.nullish),
          },
          () => true,
        )
        .otherwise(() => prev),
    );

    prevBreakPoint.current = breakPoint;
  }, [breakPoint, setIsOpen]);

  return (
    <>
      <Drawer
        variant="temporary"
        isOpen={breakPoint === BreakPoint.sm && isOpen}
        onOpenChange={setIsOpen}
        onClose={() => {
          setIsOpen(false);
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
        onOpenChange={setIsOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        className="hidden h-full w-60 bg-white md:max-lg:block"
      >
        <SidebarContent />
      </Drawer>
      <Drawer
        variant="persisted"
        isOpen={match(breakPoint)
          .with(P.nullish, () => true)
          .otherwise(() => isOpen)}
        onOpenChange={setIsOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        className="hidden h-full w-[280px] bg-white lg:block"
      >
        <SidebarContent />
      </Drawer>
    </>
  );
};
