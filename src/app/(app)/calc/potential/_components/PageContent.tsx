"use client";

import { useMolecule } from "bunshi/react";
import { useAtomValue, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { RefreshCcw } from "lucide-react";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { PageTitle, S, SectionContainer } from "~/shared/ui";

import { CalculateButton } from "./CalculateButton";
import { OptionSectionContent } from "./OptionSectionContent";
import { SettingSectionContent } from "./SettingSectionContent";

export const PageContent = () => {
  const { aimTypeAtom, optionSetFormAtom } = useMolecule(PotentialCalcMolecule);
  const aimType = useAtomValue(aimTypeAtom);

  const setOptionSets = useSetAtom(optionSetFormAtom);

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
            <SectionContainer
              title={
                <>
                  옵션 설정
                  <S.Button
                    size="sm"
                    onPress={() => {
                      setOptionSets(RESET);
                    }}
                    className="ml-2 w-20"
                    variant="flat"
                    color="primary"
                  >
                    <RefreshCcw className="size-4" /> 초기화
                  </S.Button>
                </>
              }
              className="lg:h-full"
            >
              <OptionSectionContent className="h-full" />
            </SectionContainer>
          </div>
        )}
        <CalculateButton className="lg:hidden" />
      </div>
    </div>
  );
};
