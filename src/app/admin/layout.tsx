import { type PropsWithChildren } from "react";

import { MainLayout } from "~/app/_components";

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout disableFooter>{children}</MainLayout>;
}
