import { type Metadata } from "next";

import { ScopeProvider } from "~/app/_components/providers";

import { PageContent } from "./_components/PageContent";
import { PotentialCalcScope } from "./_lib/scopes";

export const metadata: Metadata = {
  title: "메이플스토리 잠재능력 계산기",
  description: "메이플스토리 잠재능력 계산기",
  openGraph: {
    title: "메이플스토리 잠재능력 계산기",
    description: "메이플스토리 잠재능력 계산기",
  },
  keywords: ["메이플스토리", "잠재능력", "잠재", "큐브", "계산기", "시뮬"],
};

export default function Page() {
  return (
    <ScopeProvider scope={PotentialCalcScope}>
      <PageContent />
    </ScopeProvider>
  );
}
