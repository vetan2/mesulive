import { Link, Spacer } from "@nextui-org/react";
import NextLink from "next/link";

import { Logo } from "~/shared/assets/images";

import { MenuButton } from "./MenuButton";

export const Header = () => {
  return (
    <header className="flex items-center border-b-1 border-b-default-100 p-4">
      <MenuButton />
      <Spacer x={2} />
      <Link as={NextLink} href="/">
        <Logo className="h-6 md:h-8" />
      </Link>
    </header>
  );
};
