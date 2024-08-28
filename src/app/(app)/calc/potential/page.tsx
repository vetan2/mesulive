import { type Metadata } from "next";

import { PageContent } from "./_components/PageContent";
import { PotentialCalcRootMachineProvider } from "./_lib/machines/contexts";

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
    <PotentialCalcRootMachineProvider>
      <PageContent />
    </PotentialCalcRootMachineProvider>
  );
}
