"use client";

import { useSelector } from "@xstate/react";
import { Plus, RefreshCcw } from "lucide-react";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { S } from "~/shared/ui";

import { OptionRecordsSetting } from "./OptionRecordsSetting";

interface Props {
  className?: string;
}

export const OptionSectionContent = ({ className }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const optionRecordsArrayLength = useSelector(
    inputActorRef,
    ({ context }) => context.optionRecordsArray.length,
  );

  const shouldRefreshPossibleStats = useSelector(
    inputActorRef,
    ({ context }) => context.shouldRefreshPossibleStats,
  );

  return (
    <div
      onMouseOver={() => {
        if (shouldRefreshPossibleStats) {
          inputActorRef.send({ type: "FETCH_POSSIBLE_OPTION_IDS" });
        }
      }}
      className={className}
    >
      <S.Button
        size="sm"
        onClick={() => {
          inputActorRef.send({ type: "ADD_OPTION_RECORDS" });
        }}
        color="primary"
        className="w-20"
      >
        <Plus className="size-4" /> 추가
      </S.Button>
      <S.Button
        size="sm"
        onClick={() => {
          inputActorRef.send({ type: "RESET_OPTION_RECORDS_ARRAY" });
        }}
        className="ml-2 w-20"
        variant="flat"
        color="primary"
      >
        <RefreshCcw className="size-4" /> 초기화
      </S.Button>
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: optionRecordsArrayLength }).map((_, i) => (
          <OptionRecordsSetting key={i} index={i} />
        ))}
      </div>
    </div>
  );
};
