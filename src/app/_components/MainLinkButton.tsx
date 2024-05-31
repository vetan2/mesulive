import NextLink from "next/link";
import { type ReactNode } from "react";

import { cx } from "~/shared/style";
import { type SVGComponent } from "~/shared/types";
import { S } from "~/shared/ui";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  Icon: SVGComponent;
  classNames?: {
    link?: string;
    button?: string;
    icon?: string;
  };
}

export const MainLinkButton = ({
  title,
  subtitle,
  Icon,
  classNames,
}: Props) => {
  return (
    <NextLink
      href="/calc/bonus-stat"
      className={cx("w-full", classNames?.link)}
    >
      <S.Button
        size="lg"
        className={cx(
          "h-32 w-full flex-col gap-0 rounded-[32px] px-4 py-2.5 text-white",
          classNames?.button,
        )}
      >
        <Icon
          className={cx(
            `absolute inset-0 ml-[-24px] mt-[-32px] h-40 w-40 !max-w-none fill-white
            opacity-50`,
            classNames?.icon,
          )}
        />
        <p className="text-2xl font-bold">{title}</p>
        {subtitle && <p>{subtitle}</p>}
      </S.Button>
    </NextLink>
  );
};
