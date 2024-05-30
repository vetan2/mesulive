"use client";

import { Link, Spacer, type LinkProps } from "@nextui-org/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, type FC, type SVGProps } from "react";

import { cx } from "~/shared/style";

interface Props extends LinkProps {
  Icon: FC<SVGProps<SVGSVGElement>>;
  Label?: ReactNode;
}

export const NavLink = ({
  Icon,
  children,
  Label,
  className,
  ...linkProps
}: Props) => {
  console.log(Icon);
  const pathname = usePathname();

  return (
    <Link
      as={NextLink}
      {...linkProps}
      className={cx(
        `group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold
        transition-colors`,
        pathname === linkProps.href
          ? "bg-primary-50 text-primary"
          : "text-default-700 hover:opacity-100",
        "hover:bg-primary-50 hover:text-primary",
        className,
      )}
    >
      <div className="flex items-center">
        <Icon
          className={cx(
            "size-5 transition-colors",
            pathname === linkProps.href ? "fill-primary" : "fill-default-700",
            "group-hover:fill-primary",
          )}
        />
        <Spacer x={2} />
        {children}
      </div>
      {Label && (
        <div
          className={cx(
            "flex h-5 items-center rounded-md px-1 text-xs font-medium text-white",
            pathname === linkProps.href ? "bg-primary" : "bg-default-700",
            "transition-colors group-hover:bg-primary",
          )}
        >
          {Label}
        </div>
      )}
    </Link>
  );
};
