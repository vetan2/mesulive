import { useSelector } from "@xstate/react";
import { identity, pipe } from "fp-ts/lib/function";
import { isEqual } from "lodash-es";
import { X } from "lucide-react";
import { P, match } from "ts-pattern";

import { PotentialCalcRootMachineContext } from "~/app/(app)/calc/potential/_lib/machines/contexts";
import { E } from "~/shared/fp";
import { entries } from "~/shared/object";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  index: number;
}

export const OptionRecordsSetting = ({ index }: Props) => {
  const inputActorRef = PotentialCalcRootMachineContext.useSelector(
    ({ context }) => context.inputActorRef,
  );

  const optionRecords = useSelector(
    inputActorRef,
    ({ context }) => context.optionRecordsArray.at(index),
    isEqual,
  );

  const possibleOptionIds = useSelector(
    inputActorRef,
    ({ context }) => context.possibleStats,
  );

  const state = useSelector(inputActorRef, ({ value }) => value);

  if (!optionRecords) {
    return null;
  }

  return (
    <S.Card shadow="sm" className="flex flex-col gap-3 overflow-visible p-3">
      {optionRecords.map((record, recordIndex) => (
        <div key={recordIndex} className="flex items-start gap-3">
          <S.Select
            isLoading={state === "fetchingPossibleOptionIds"}
            isDisabled={state === "fetchingPossibleOptionIds"}
            size="sm"
            className="flex-[3]"
            placeholder="옵션 선택"
            aria-label="옵션 선택"
            selectedKeys={record.stat.input ? [record.stat.input] : []}
            onChange={(e) => {
              inputActorRef.send({
                index,
                recordIndex,
                type: "EDIT_OPTION_RECORD",
                stat: e.target.value,
              });
            }}
          >
            {[["NONE", "없음"], ...entries(possibleOptionIds)].map(
              ([stat, name]) => (
                <S.SelectItem
                  key={stat}
                  value={stat}
                  className={cx(stat === "NONE" && "text-gray-400")}
                >
                  {name}
                </S.SelectItem>
              ),
            )}
          </S.Select>
          <S.Input
            type="number"
            size="sm"
            className="flex-1"
            value={record.figure.input}
            onValueChange={(v) => {
              inputActorRef.send({
                index,
                recordIndex,
                type: "EDIT_OPTION_RECORD",
                figure: v,
              });
            }}
            isInvalid={E.isLeft(record.figure.value)}
            errorMessage={pipe(
              record.figure.value,
              E.match(identity, () => undefined),
            )}
            endContent={
              <span className="text-sm text-gray-400">
                {match(
                  pipe(
                    record.stat.value,
                    E.getOrElseW(() => undefined),
                  ),
                )
                  .with(
                    P.union(
                      P.union(
                        "ALL %",
                        "ATTACK %",
                        "BOSS_DAMAGE",
                        "CRITICAL_DAMAGE",
                        "DAMAGE",
                        "DEX %",
                        "HP %",
                        "IGNORE_DEFENSE",
                        "INT %",
                        "ITEM_DROP",
                        "LUK %",
                        "MAGIC_ATTACK %",
                        "MESO_OBTAIN",
                        "STR %",
                      ),
                    ),
                    () => "%",
                  )
                  .with("COOL_DOWN", () => "초")
                  .otherwise(() => "")}
              </span>
            }
          />
        </div>
      ))}
      <S.Button
        className="absolute right-[-8px] top-[-8px] z-10 !size-6 min-w-0 bg-danger-100 p-1"
        radius="full"
        size="sm"
        isIconOnly
        color="danger"
        variant="flat"
        onClick={() => {
          inputActorRef.send({ type: "REMOVE_OPTION_RECORD", index });
        }}
      >
        <X />
      </S.Button>
    </S.Card>
  );
};
