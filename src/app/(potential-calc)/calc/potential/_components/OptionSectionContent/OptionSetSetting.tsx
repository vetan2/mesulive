import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { useMemo } from "react";
import { P, match } from "ts-pattern";

import { PotentialCalcMolecule } from "~/app/(potential-calc)/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { type EffectiveStat, effectiveStatLabels } from "~/entities/stat";
import { E, O } from "~/shared/fp";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  index: number;
}

export const OptionSetSetting = ({ index }: Props) => {
  const {
    optionSetFormAtom,
    editOptionAtom,
    removeOptionSetAtom,
    possibleOptionIdsAtom,
    isPendingForPossibleOptionIdsAtom,
  } = useMolecule(PotentialCalcMolecule);
  const optionSetAtom = useMemo(
    () => atom((get) => get(optionSetFormAtom).at(index)),
    [index, optionSetFormAtom],
  );

  const optionSet = useAtomValue(optionSetAtom);
  const possibleOptionIds = useAtomValue(possibleOptionIdsAtom);
  const isPendingForPossibleOptionIds = useAtomValue(
    isPendingForPossibleOptionIdsAtom,
  );

  const editOption = useSetAtom(editOptionAtom);
  const removeOptionSet = useSetAtom(removeOptionSetAtom);

  if (!optionSet) {
    return null;
  }

  const convertStatToOption = (stat: EffectiveStat): [string, string] => [
    stat,
    effectiveStatLabels[stat],
  ];

  const enableOptions: [string, string][] = [
    ["NONE", "없음"],
    ...(possibleOptionIds ?? []).map(convertStatToOption),
  ];
  const unableStats = Potential.possibleStats.filter(
    (s) => !possibleOptionIds?.includes(s),
  );
  const unableOptions = unableStats.map(convertStatToOption);

  return (
    <S.Card shadow="sm" className="flex flex-col gap-3 overflow-visible p-3">
      {optionSet.map((record, recordIndex) => (
        <div key={recordIndex} className="flex items-start gap-3">
          <S.Select
            isLoading={isPendingForPossibleOptionIds}
            isDisabled={isPendingForPossibleOptionIds}
            disabledKeys={unableStats}
            size="sm"
            className="flex-[3]"
            placeholder="옵션 선택"
            aria-label="옵션 선택"
            selectedKeys={pipe(
              record.stat,
              O.match(
                () => [],
                (v) => [v],
              ),
            )}
            onChange={(e) => {
              editOption({
                setIndex: index,
                optionIndex: recordIndex,
                stat: e.target.value,
              });
            }}
            isInvalid={pipe(
              record.stat,
              O.match(
                () => false,
                (s) => unableStats.some((stat) => stat === s),
              ),
            )}
            errorMessage="해당 옵션은 설정된 장비에 적용할 수 없습니다."
          >
            <>
              {enableOptions.map(([stat, name]) => (
                <S.SelectItem
                  key={stat}
                  value={stat}
                  className={cx(stat === "NONE" && "text-default-400")}
                >
                  {name}
                </S.SelectItem>
              ))}
              {unableOptions.map(([stat, name]) => (
                <S.SelectItem key={stat} value={stat} className="hidden">
                  {name}
                </S.SelectItem>
              ))}
            </>
          </S.Select>
          <S.Input
            type="number"
            size="sm"
            className="flex-1"
            value={record.figure.input}
            onValueChange={(v) => {
              editOption({
                setIndex: index,
                optionIndex: recordIndex,
                figure: v,
              });
            }}
            isInvalid={O.isSome(record.stat) && E.isLeft(record.figure.value)}
            errorMessage={pipe(
              record.stat,
              O.map(() =>
                pipe(
                  record.figure.value,
                  E.match(identity, () => undefined),
                ),
              ),
              O.toUndefined,
            )}
            endContent={
              <span className="text-sm text-gray-400">
                {match(O.toUndefined(record.stat))
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
                        "AUTO_STEAL",
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
        onPress={() => {
          removeOptionSet(index);
        }}
      >
        <X />
      </S.Button>
    </S.Card>
  );
};
