"use client";

import { Notice } from "~/app/_components";
import { PageTitle } from "~/shared/ui";

export const PageContent = () => {
  return (
    <div className="mx-auto max-w-screen-xl">
      <PageTitle endColorVar="var(--mesulive-primary)">
        스타포스 시뮬레이터
      </PageTitle>
      <Notice />
    </div>
  );
};
