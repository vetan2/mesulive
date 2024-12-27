import { Link } from "@nextui-org/react";
import { type Metadata } from "next";

import { Flame, Logo, PotentialSVG, Star } from "~/shared/assets/images";
import { cx } from "~/shared/style";
import { SectionContainer } from "~/shared/ui";

import { MainLinkButton } from "./_components";
import { DeveloperProfile } from "./_components/DeveloperProfile";
import { Notices } from "./_components/Notices";

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
      <Notices classNames={{ container: "mt-0 mb-4" }} />
      <SectionContainer className="flex flex-col items-center">
        <Logo className="h-8 lg:h-12" />
        <p className="mt-1 text-center text-sm text-default-500">
          메이플스토리의 각종 확률형 시스템에 대한 기댓값 계산기와 시뮬레이션
          웹서비스입니다.
          <br />
          문의와 후원은{" "}
          <Link
            href="https://open.kakao.com/me/kurate"
            className="text-sm"
            color="foreground"
            showAnchorIcon
          >
            오픈채팅
          </Link>
          으로 부탁드립니다.
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
              button: cx("bg-primary"),
            }}
          />
        </div>
        <div className="mt-4">
          <DeveloperProfile />
        </div>
      </SectionContainer>
    </div>
  );
}
