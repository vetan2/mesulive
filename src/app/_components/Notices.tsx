"use client";

import { type AlertProps } from "@nextui-org/react";
import { omit } from "lodash-es";
import { CirclePlus } from "lucide-react";
import NextLink from "next/link";
import { useRef } from "react";

import { getKSTDate } from "~/shared/date";
import { cx } from "~/shared/style";
import { mergeClassNames } from "~/shared/style/utils";
import { type Optional } from "~/shared/types";
import { S } from "~/shared/ui";

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
        <S.Link
          as={NextLink}
          href="/calc/potential"
          className="text-sm text-white"
          underline="always"
          showAnchorIcon
        >
          잠재능력 계산기
        </S.Link>
        에 미라클 타임 기능이 추가되었습니다.
      </>
    ),
    date: getKSTDate("2024-12-24"),
    classNames: {
      base: cx("bg-primary-400"),
      alertIcon: cx("fill-white text-primary-400"),
    },
    icon: <CirclePlus />,
  },
];

export const Notices = ({ classNames }: Props) => {
  const now = useRef(new Date());
  const contents = noticeContents.filter(
    ({ date }) =>
      Math.abs(now.current.getTime() - date.getTime()) <=
      14 * 24 * 60 * 60 * 1000,
  );

  return contents.length > 0 ? (
    <div className={cx("my-2 flex flex-col gap-2", classNames?.container)}>
      {contents.map(
        (
          { variant, color, description, classNames: contentClassNames, icon },
          index,
        ) => (
          <S.Alert
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
