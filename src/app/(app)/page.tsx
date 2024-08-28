import { Link } from "@nextui-org/react";
import { type Metadata } from "next";
import NextImage from "next/image";

import { MainLinkButton } from "~/app/_components";
import {
  Flame,
  Logo,
  PotentialSVG,
  Reboot,
  Star,
  DeveloperCharacter,
} from "~/shared/assets/images";
import { cx } from "~/shared/style";
import { SectionContainer } from "~/shared/ui";

export const metadata: Metadata = {
  title: "메수라이브 - 메이플 시뮬레이터, 계산기",
  description: "메수라이브, 각종 메이플 시뮬레이터와 기댓값 계산기",
  openGraph: {
    title: "메수라이브 - 메이플 시뮬레이터, 계산기",
    description: "메수라이브, 각종 메이플 시뮬레이터와 기댓값 계산기",
  },
  keywords: ["메이플스토리", "시뮬레이터", "기댓값", "계산기"],
};

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <SectionContainer className="flex flex-col items-center">
        <Logo className="h-8 lg:h-12" />
        <p className="mt-1 text-center text-sm text-default-500">
          메이플스토리의 각종 확률형 시스템에 대한 기댓값 계산기와 시뮬레이션
          웹서비스입니다.
          <br />
          문의는 help@mesu.live로 부탁드립니다.
        </p>
        <div className="mt-4 flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-2">
          <MainLinkButton
            href="/calc/bonus-stat"
            title="추가옵션 기댓값 계산기"
            Icon={Flame}
            classNames={{ button: cx("bg-secondary-500") }}
          />
          <MainLinkButton
            href="/calc/potential"
            title="잠재능력 기댓값 계산기"
            Icon={PotentialSVG}
            classNames={{ button: cx("bg-warning-500") }}
          />
          <MainLinkButton
            href="/sim/starforce"
            title="스타포스 시뮬레이터"
            Icon={Star}
            classNames={{
              link: cx("md:last:col-span-full"),
              button: cx("bg-primary-500"),
            }}
          />
        </div>
        <div className="mt-4">
          <Link
            href="https://maple.gg/u/%EC%BF%A0%EB%9D%BC%ED%85%8C"
            target="_blank"
            rel="noreferrer"
            className="flex-col text-sm"
            color="foreground"
          >
            <NextImage src={DeveloperCharacter} alt="제작자" />
            <div className="flex items-center">
              <p>제작자: 쿠라테</p>
              <NextImage src={Reboot} alt="리부트" className="ml-1 mt-0.5" />
            </div>
          </Link>
        </div>
      </SectionContainer>
    </div>
  );
}
