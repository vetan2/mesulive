import { Link, Navbar } from "@nextui-org/react";
import NextLink from "next/link";
import { type RefObject } from "react";

import { Logo } from "~/shared/assets/images";
import { cx } from "~/shared/style";

import { MenuButton } from "./MenuButton";

interface Props {
  parentRef: RefObject<HTMLElement>;
}

export const Header = ({ parentRef }: Props) => {
  return (
    <Navbar
      classNames={{
        base: cx("justify-start border-b-1 border-b-default-100 p-4"),
        wrapper: cx("h-fit justify-start gap-0 p-0"),
      }}
      shouldHideOnScroll
      parentRef={parentRef}
    >
      <MenuButton />
      <Link as={NextLink} href="/" className="ml-2">
        <Logo className="h-6 md:h-8" />
      </Link>
    </Navbar>
  );
};
