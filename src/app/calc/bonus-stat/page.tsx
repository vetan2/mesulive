import { type Metadata } from "next";

import { PageTitle, SectionContainer } from "~/shared/ui";

import {
  SettingSectionContent,
  StatEfficiencyModal,
  StatSimulationContent,
  StatSimulationModal,
} from "./_components";
import { BonusStatCalcProvider } from "./_lib";

export const metadata: Metadata = {
  title: "메이플스토리 추가옵션 계산기",
  description: "메이플스토리 추가옵션 계산기",
  openGraph: {
    title: "메이플스토리 추가옵션 계산기",
    description: "메이플스토리 추가옵션 계산기",
  },
  keywords: ["메이플스토리", "추가옵션", "계산기"],
};

export default function Page() {
  return (
    <BonusStatCalcProvider>
      <div className="mx-auto max-w-screen-xl">
        <PageTitle endColorVar="var(--mesulive-secondary-500)">
          추가옵션 기댓값 계산기
        </PageTitle>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          <div className="flex w-full flex-col gap-4 lg:flex-1">
            <SectionContainer title="설정">
              <SettingSectionContent />
            </SectionContainer>
            <SectionContainer
              title="스탯 환산치 계산"
              className="hidden lg:block"
            >
              <StatSimulationContent />
            </SectionContainer>
          </div>
          <SectionContainer title="계산 결과" className="w-full lg:flex-1">
            계산 결과
          </SectionContainer>
        </div>
      </div>
      <StatEfficiencyModal />
      <StatSimulationModal />
    </BonusStatCalcProvider>
  );
}
