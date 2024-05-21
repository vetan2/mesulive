import { type ReactNode } from "react";

import { cx } from "~/shared/style";
import { Sidebar } from "~/widgets/Sidebar";

interface Props {
  children?: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen max-h-screen flex-col">
      <header>Header</header>
      <div className="relative flex h-0 flex-1">
        <Sidebar />
        <main className={cx("max-h-full flex-1 overflow-y-auto bg-primary-100")}>{children}</main>
      </div>
    </div>
  );
};
