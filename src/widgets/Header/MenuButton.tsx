"use client";

import { useSetAtom } from "jotai";
import { MenuIcon } from "lucide-react";

import { S } from "~/shared/ui";
import { sidebarAtoms } from "~/widgets/Sidebar/atoms";

export const MenuButton = () => {
  const setIsSidebarOpen = useSetAtom(sidebarAtoms.isOpen);

  return (
    <S.Button
      isIconOnly
      size="sm"
      variant="light"
      color="primary"
      onClick={() => {
        setIsSidebarOpen((prev) => !prev);
      }}
      className="xl:hidden"
    >
      <MenuIcon className="size-5 md:size-6" />
    </S.Button>
  );
};
