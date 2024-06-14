import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { type RefObject } from "react";

import { Logo } from "~/shared/assets/images";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

import { MenuButton } from "./MenuButton";

interface Props {
  parentRef: RefObject<HTMLElement>;
}

export const Header = ({ parentRef }: Props) => {
  return (
    <S.Navbar
      classNames={{
        base: cx("border-b-1 border-b-default-100 p-4 justify-start"),
        wrapper: cx("h-fit justify-start gap-0 p-0"),
      }}
      shouldHideOnScroll
      parentRef={parentRef}
    >
      <MenuButton />
      <Link as={NextLink} href="/" className="ml-2">
        <Logo className="h-6 md:h-8" />
      </Link>
    </S.Navbar>
  );
};
