"use client";

import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { P, match } from "ts-pattern";

import { BreakPoint, useBreakPoint } from "~/shared/style/breakPoint";
import { Sidebar, SidebarAtoms } from "~/widgets/Sidebar";

interface Props {
  children?: ReactNode;
}

const defaultSidebarOpen: Record<BreakPoint, boolean> = {
  [BreakPoint.sm]: false,
  [BreakPoint.md]: false,
  [BreakPoint.lg]: true,
  [BreakPoint.xl]: true,
};

export const MainLayout = ({ children }: Props) => {
  const breakPoint = useBreakPoint({ initializeWithValue: false });
  const [isOpen, setIsOpen] = useAtom(SidebarAtoms.isOpen);
  const [needTransition, setNeedTransition] = useState(false);
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setIsOpen((prev) =>
      match(breakPoint)
        .with(BreakPoint.sm, () => false)
        .with(BreakPoint.md, () => false)
        .with(BreakPoint.lg, () => true)
        .with(BreakPoint.xl, () => true)
        .otherwise(() => prev),
    );
  }, [breakPoint, setIsOpen]);

  useEffect(() => {
    match(breakPoint)
      .with(P.nullish, () => {})
      .when(
        (breakPoint) => breakPoint === BreakPoint.md,
        () => {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            setNeedTransition(true);
          }, 0);
        },
      )
      .when(
        (breakPoint) => breakPoint === BreakPoint.sm,
        () => {
          clearTimeout(timeout.current);
          setTimeout(() => setNeedTransition(false), 250);
        },
      )
      .otherwise(() => {});
  }, [breakPoint]);

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <header>Header</header>
      <div className="relative flex h-0 flex-1">
        <Sidebar isOpen={isOpen} onOpenChange={setIsOpen} />
        <motion.main
          className={cn(
            "max-h-full flex-1 overflow-y-auto bg-primary-100",
            needTransition && "md:transition-all",
            match(breakPoint)
              .with(P.nullish, () => "ml-0 md:ml-[-240px] lg:ml-0")
              .when(
                (breakPoint) => breakPoint <= BreakPoint.sm,
                () => "ml-0",
              )
              .otherwise(() => (isOpen ? "ml-0" : "ml-[-240px] lg:ml-[-280px]")),
          )}
          // initial={false}
          // animate={{ marginLeft: (breakPoint ?? -Infinity) >= BreakPoint.sm && isOpen ? 0 : -240 }}
          // transition={drawerTransition}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
