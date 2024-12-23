"use client";

import { useSetAtom } from "jotai";
import { MenuIcon } from "lucide-react";

import { sidebarAtoms } from "~/app/_components/Sidebar/atoms";
import { S } from "~/shared/ui";

export const MenuButton = () => {
  const setIsSidebarOpen = useSetAtom(sidebarAtoms.isOpen);

  return (
    <S.Button
      isIconOnly
      size="sm"
      variant="light"
      color="primary"
      onPress={() => {
        setIsSidebarOpen((prev) => !prev);
      }}
      className="xl:hidden"
    >
      <MenuIcon className="size-5 md:size-6" />
    </S.Button>
  );
};
