"use client";

import { useRef, type ReactNode } from "react";

import { cx } from "~/shared/style";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface Props {
  children?: ReactNode;
  disableFooter?: boolean;
}

export const MainLayout = ({ children, disableFooter }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header parentRef={ref} />
      <div className="relative flex h-0 flex-1">
        <Sidebar />
        <div
          ref={ref}
          className="mt-[-65px] h-screen flex-1 overflow-y-auto bg-default-50 pt-[65px]"
        >
          <main className={cx("p-4")}>{children}</main>
          {!disableFooter && <Footer />}
        </div>
      </div>
    </div>
  );
};
