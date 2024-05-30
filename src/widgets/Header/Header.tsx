import { Spacer } from "@nextui-org/react";

import Logo from "~/shared/assets/images/logo.svg";

import { MenuButton } from "./MenuButton";

export const Header = () => {
  return (
    <header className="flex items-center border-b-1 border-b-default-100 p-4">
      <MenuButton />
      <Spacer x={2} />
      <Logo className="h-6 md:h-8" />
    </header>
  );
};
