import { type ReactNode } from "react";

import { cx } from "~/shared/style";
import { Header } from "~/widgets/Header";
import { Sidebar } from "~/widgets/Sidebar";

interface Props {
  children?: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <Header />
      <div className="relative flex h-0 flex-1">
        <Sidebar />
        <main className={cx("max-h-full flex-1 overflow-y-auto bg-default-50")}>{children}</main>
      </div>
    </div>
  );
};
