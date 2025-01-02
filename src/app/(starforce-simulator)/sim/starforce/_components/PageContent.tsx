"use client";

import { Notice } from "~/app/_components";
import { PageTitle, SectionContainer } from "~/shared/ui";

import { EquipSettingSectionContent } from "./EquipSettingSectionContent";

export const PageContent = () => {
  return (
    <div className="mx-auto max-w-screen-xl">
      <PageTitle endColorVar="var(--mesulive-primary)">
        스타포스 시뮬레이터
      </PageTitle>
      <Notice />
      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:flex-1">
          <SectionContainer title="장비 설정">
            <EquipSettingSectionContent />
          </SectionContainer>
        </div>
      </div>
    </div>
  );
};
