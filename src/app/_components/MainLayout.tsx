import { type ReactNode } from "react";

import { cx } from "~/shared/style";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface Props {
  children?: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header />
      <div className="relative flex h-0 flex-1">
        <Sidebar />
        <div className="max-h-full flex-1 overflow-y-auto bg-default-50">
          <main className={cx("p-4")}>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
