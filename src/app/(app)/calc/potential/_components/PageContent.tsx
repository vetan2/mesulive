"use client";

import { useSelector } from "@xstate/react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { PageTitle, S, SectionContainer } from "~/shared/ui";

import { OptionSectionContent } from "./OptionSectionContent";
import { SettingSectionContent } from "./SettingSectionContent";

export const PageContent = () => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const aimType = useSelector(inputActorRef, ({ context }) => context.aimType);

  return (
    <div className="mx-auto max-w-screen-xl">
      <PageTitle endColorVar="var(--mesulive-warning-500)">
        잠재능력 기댓값 계산기
      </PageTitle>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:flex-1">
          <SectionContainer title="설정">
            <SettingSectionContent />
          </SectionContainer>
          <S.Button
            size="lg"
            color="primary"
            className="hidden font-bold lg:block"
          >
            계산하기
          </S.Button>
        </div>
        {aimType === "OPTIONS" && (
          <div className="flex w-full flex-col gap-4 lg:min-h-full lg:flex-1">
            <SectionContainer title="옵션 설정" className="lg:h-full">
              <OptionSectionContent className="h-full" />
            </SectionContainer>
          </div>
        )}
        <S.Button size="lg" color="primary" className="font-bold lg:hidden">
          계산하기
        </S.Button>
      </div>
    </div>
  );
};
