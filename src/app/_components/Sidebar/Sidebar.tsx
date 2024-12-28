"use client";

import { useAtom } from "jotai";
import { P, match } from "ts-pattern";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { Drawer } from "~/shared/ui/Drawer";

import { sidebarAtoms } from "./atoms";
import { SidebarContent } from "./SidebarContent";

export const Sidebar = () => {
  const breakPoint = useBreakPoint({ initializeWithValue: false });
  const [isOpen, setIsOpen] = useAtom(sidebarAtoms.isOpen);

  useIsomorphicLayoutEffect(() => {
    setIsOpen((prev) =>
      match({ breakPoint })
        .with(
          {
            breakPoint: P.union(BreakPoint.sm, BreakPoint.md),
          },
          () => false,
        )
        .with(
          {
            breakPoint: BreakPoint.lg,
          },
          () => true,
        )
        .otherwise(() => prev),
    );
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
        className="h-full w-72 bg-white md:hidden"
      >
        <SidebarContent
          onLinkPress={() => {
            setIsOpen(false);
          }}
        />
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
        className="hidden h-full w-72 border-r-1 border-r-default-100 bg-white md:max-lg:block"
      >
        <SidebarContent key="persisted-md" />
      </Drawer>
      <Drawer
        variant="persisted"
        isOpen={match(breakPoint)
          .with(P.union(P.nullish, BreakPoint.xl), () => true)
          .otherwise(() => isOpen)}
        onOpenChange={setIsOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        className="hidden h-full border-r-1 border-r-default-100 bg-white lg:block"
      >
        <SidebarContent key="persisted-lg" />
      </Drawer>
    </>
  );
};
