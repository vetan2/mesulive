import { type Metadata } from "next";

import { ScopeProvider } from "~/app/_components/providers";

import { PageContent } from "./_components/PageContent";
import { StarforceSimulatorScope } from "./_lib/molecule";

export const metadata: Metadata = {
  title: "메이플스토리 스타포스 시뮬레이터",
  description: "메이플스토리 스타포스 시뮬레이터",
  openGraph: {
    title: "메이플스토리 스타포스 시뮬레이터",
    description: "메이플스토리 스타포스 시뮬레이터",
  },
  keywords: ["메이플스토리", "스타포스", "계산기", "시뮬"],
};

export default function Page() {
  return (
    <ScopeProvider scope={StarforceSimulatorScope}>
      <PageContent />
    </ScopeProvider>
  );
}
