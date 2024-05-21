"use client";

import { Button } from "@nextui-org/react";
import { useSetAtom } from "jotai";

import { sidebarAtoms } from "~/widgets/Sidebar/atoms";

export default function Home() {
  const setSidebarOpen = useSetAtom(sidebarAtoms.isOpen);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Button
        onClick={() => {
          setSidebarOpen((prev) => !prev);
        }}
      >
        사이드바 열기/닫기
      </Button>
      <div className="w-full flex-1">내용</div>
    </main>
  );
}
