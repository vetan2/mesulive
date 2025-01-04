"use client";

import { Alert, Link, type AlertProps } from "@nextui-org/react";
import { omit } from "lodash-es";
import { CirclePlus } from "lucide-react";
import NextLink from "next/link";
import { useRef } from "react";

import { getKSTDate } from "~/shared/date";
import { cx } from "~/shared/style";
import { mergeClassNames } from "~/shared/style/utils";
import { type Optional } from "~/shared/types";

interface Props {
  classNames?: AlertProps["classNames"] & { container?: string };
}

const noticeContents: (Optional<
  Pick<AlertProps, "variant" | "description" | "color" | "classNames" | "icon">,
  "variant" | "color"
> & {
  date: Date;
})[] = [
  {
    variant: "solid",
    color: "primary",
    description: (
      <>
        2024.12.24{" "}
        <Link
          as={NextLink}
          href="/calc/potential"
          className="text-sm text-white"
          underline="always"
          showAnchorIcon
        >
          잠재능력 계산기
        </Link>
        에 <b>미라클 타임</b> 기능이 추가되었습니다.
      </>
    ),
    date: getKSTDate("2024-12-24"),
    classNames: {
      base: cx("bg-primary-400"),
      alertIcon: cx("fill-white text-primary-400"),
    },
    icon: <CirclePlus />,
  },
  {
    variant: "solid",
    color: "secondary",
    description: (
      <>
        2024.12.25{" "}
        <Link
          as={NextLink}
          href="/calc/potential"
          className="text-sm text-white"
          underline="always"
          showAnchorIcon
        >
          잠재능력 계산기
        </Link>
        에 <b>옵션 세트 프리셋</b> 기능이 추가되었습니다.
      </>
    ),
    date: getKSTDate("2024-12-25"),
    classNames: {
      base: cx("bg-secondary-500"),
      alertIcon: cx("fill-white text-secondary-500"),
    },
    icon: <CirclePlus />,
  },
];

export const Notices = ({ classNames }: Props) => {
  const now = useRef(new Date());
  const contents = noticeContents.filter(
    ({ date }) =>
      Math.abs(now.current.getTime() - date.getTime()) <=
      10 * 24 * 60 * 60 * 1000,
  );

  return contents.length > 0 ? (
    <div className={cx("my-2 flex flex-col gap-2", classNames?.container)}>
      {contents.map(
        (
          { variant, color, description, classNames: contentClassNames, icon },
          index,
        ) => (
          <Alert
            key={index}
            radius="full"
            icon={icon}
            variant={variant ?? "faded"}
            color={color ?? "primary"}
            classNames={mergeClassNames(
              {
                base: cx("items-center rounded-[20px] px-4 py-2"),
                iconWrapper: cx("h-6 w-6 border-none shadow-none"),
                title: cx("hidden"),
                mainWrapper: cx("ms-1 min-h-8 justify-center"),
                description: cx("font-semibold"),
              },
              contentClassNames,
              omit(classNames, "container"),
            )}
            description={description}
          />
        ),
      )}
    </div>
  ) : null;
};
