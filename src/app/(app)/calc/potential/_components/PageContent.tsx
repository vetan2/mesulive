"use client";

import { useMolecule } from "bunshi/react";
import { useAtomValue } from "jotai";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { PageTitle, SectionContainer } from "~/shared/ui";

import { CalculateButton } from "./CalculateButton";
import { OptionSectionContent } from "./OptionSectionContent";
import { SettingSectionContent } from "./SettingSectionContent";

export const PageContent = () => {
  const { aimTypeAtom } = useMolecule(PotentialCalcMolecule);
  const aimType = useAtomValue(aimTypeAtom);

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
          <CalculateButton className="hidden lg:flex" />
        </div>
        {aimType === "OPTIONS" && (
          <div className="flex w-full flex-col gap-4 lg:min-h-full lg:flex-1">
            <SectionContainer title="옵션 설정" className="lg:h-full">
              <OptionSectionContent className="h-full" />
            </SectionContainer>
          </div>
        )}
        <CalculateButton className="lg:hidden" />
      </div>
    </div>
  );
};
