import { useMolecule } from "bunshi/react";
import { ord } from "fp-ts";
import { identity, pipe } from "fp-ts/lib/function";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { type inferData, type inferVariables } from "react-query-kit";
import { P, match } from "ts-pattern";
import { useDebounceValue } from "usehooks-ts";

import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { type Potential } from "~/entities/potential";
import { flattenLevel } from "~/entities/potential/utils";
import { effectiveStatLabels, effectiveStatOptions } from "~/entities/stat";
import { PotentialQueries } from "~/features/get-potential-data/queries";
import { A, E, O } from "~/shared/fp";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

interface Props {
  index: number;
}

export const OptionSetSetting = ({ index }: Props) => {
  const {
    optionSetFormAtom,
    levelAtom,
    equipAtom,
    gradeAtom,
    typeAtom,
    aimTypeAtom,
    editOptionAtom,
    removeOptionSetAtom,
    adjustOptionSetsAtom,
    completeLoadingPossibleOptionIdsAtom,
  } = useMolecule(PotentialCalcMolecule);
  const optionSetAtom = useMemo(
    () => atom((get) => get(optionSetFormAtom).at(index)),
    [index, optionSetFormAtom],
  );
  const level = useAtomValue(levelAtom);
  const optionSet = useAtomValue(optionSetAtom);
  const equip = useAtomValue(equipAtom);
  const grade = useAtomValue(gradeAtom);
  const type = useAtomValue(typeAtom);
  const aimType = useAtomValue(aimTypeAtom);
  const editOption = useSetAtom(editOptionAtom);
  const removeOptionSet = useSetAtom(removeOptionSetAtom);
  const adjustOptionSets = useSetAtom(adjustOptionSetsAtom);
  const completeLoadingPossibleOptionIds = useSetAtom(
    completeLoadingPossibleOptionIdsAtom,
  );

  const [variables] = useDebounceValue<
    inferVariables<typeof PotentialQueries.useOptionTable>
  >(
    useMemo(
      () => ({
        equip,
        grade,
        level: pipe(
          O.fromEither(level.value),
          O.chain(flattenLevel),
          O.getOrElse(() => 200),
        ),
        method: match(type)
          .returnType<Potential.ResetMethod>()
          .with("ADDI", () => "ADDI_POTENTIAL")
          .with("COMMON", () => "POTENTIAL")
          .exhaustive(),
      }),
      [equip, grade, level.value, type],
    ),
    300,
  );

  const possibleOptionIds = PotentialQueries.useOptionTable({
    variables,
    enabled: aimType === "OPTIONS",
    select: useCallback(
      (data: inferData<typeof PotentialQueries.useOptionTable>) =>
        pipe(
          data,
          A.flatMap(
            A.filterMap(({ option: { stat } }) => O.fromNullable(stat)),
          ),
          (arr) => [...new Set(arr)],
          A.sort(
            ord.fromCompare<Potential.PossibleStat>((statA, statB) =>
              effectiveStatOptions.indexOf(statA) >
              effectiveStatOptions.indexOf(statB)
                ? 1
                : -1,
            ),
          ),
        ),
      [],
    ),
  });

  useEffect(() => {
    if (possibleOptionIds.isSuccess) {
      adjustOptionSets(possibleOptionIds.data);
      completeLoadingPossibleOptionIds();
    }
  }, [
    adjustOptionSets,
    possibleOptionIds.data,
    possibleOptionIds.isSuccess,
    completeLoadingPossibleOptionIds,
  ]);

  if (!optionSet) {
    return null;
  }

  return (
    <S.Card shadow="sm" className="flex flex-col gap-3 overflow-visible p-3">
      {optionSet.map((record, recordIndex) => (
        <div key={recordIndex} className="flex items-start gap-3">
          <S.Select
            isLoading={possibleOptionIds.isLoading}
            isDisabled={possibleOptionIds.isLoading}
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
          >
            {[
              ["NONE", "없음"],
              ...(possibleOptionIds.data ?? []).map((stat) => [
                stat,
                effectiveStatLabels[stat],
              ]),
            ].map(([stat, name]) => (
              <S.SelectItem
                key={stat}
                value={stat}
                className={cx(stat === "NONE" && "text-gray-400")}
              >
                {name}
              </S.SelectItem>
            ))}
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
          removeOptionSet(index);
        }}
      >
        <X />
      </S.Button>
    </S.Card>
  );
};
