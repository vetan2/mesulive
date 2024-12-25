"use client";

import { useMolecule } from "bunshi/react";
import { ord } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { sign } from "fp-ts/lib/Ordering";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { type inferData, type inferVariables } from "react-query-kit";
import { match } from "ts-pattern";
import { useDebounceValue } from "usehooks-ts";

import { PotentialCalcMolecule } from "~/app/calc/potential/_lib/molecules";
import { Potential } from "~/entities/potential";
import { PotentialQueries } from "~/features/get-potential-data/queries";
import { A, O } from "~/shared/fp";

export const useRegisterPossibleOptionIdsUpdate = () => {
  const molecule = useMolecule(PotentialCalcMolecule);
  const {
    levelAtom,
    equipAtom,
    gradeAtom,
    typeAtom,
    aimTypeAtom,
    adjustOptionSetsAtom,
    completeLoadingPossibleOptionIdsAtom,
    possibleOptionIdsAtom,
  } = molecule;

  const level = useAtomValue(levelAtom);
  const equip = useAtomValue(equipAtom);
  const grade = useAtomValue(gradeAtom);
  const type = useAtomValue(typeAtom);
  const aimType = useAtomValue(aimTypeAtom);

  const adjustOptionSets = useSetAtom(adjustOptionSetsAtom);
  const completeLoadingPossibleOptionIds = useSetAtom(
    completeLoadingPossibleOptionIdsAtom,
  );
  const setPossibleOptionIds = useSetAtom(possibleOptionIdsAtom);

  const [variables] = useDebounceValue<
    inferVariables<typeof PotentialQueries.useOptionTables>
  >(
    useMemo(
      () => ({
        equip,
        grade,
        level: pipe(
          O.fromEither(level.value),
          O.chain(Potential.flattenLevel),
          O.getOrElse(() => 200),
        ),
        method: match(type)
          .returnType<Potential.ResetMethod>()
          .with("ADDI", () => "ADDI_POTENTIAL")
          .with("COMMON", () => "ARTISAN")
          .exhaustive(),
      }),
      [equip, grade, level.value, type],
    ),
    300,
  );

  const possibleOptionIds = PotentialQueries.useOptionTables({
    variables,
    enabled: aimType === "OPTIONS",
    select: useCallback(
      (data: inferData<typeof PotentialQueries.useOptionTables>) =>
        pipe(
          data,
          A.flatMap(A.filterMap(({ stat }) => O.fromNullable(stat))),
          (arr) => [...new Set(arr)],
          A.sort(
            ord.fromCompare<Potential.PossibleStat>((statA, statB) =>
              sign(
                Potential.possibleStats.indexOf(statA) -
                  Potential.possibleStats.indexOf(statB),
              ),
            ),
          ),
        ),
      [],
    ),
  });

  useEffect(() => {
    if (possibleOptionIds.isSuccess) {
      setPossibleOptionIds(possibleOptionIds.data);
    } else if (possibleOptionIds.isError) {
      setPossibleOptionIds([]);
    }
  }, [
    possibleOptionIds.data,
    possibleOptionIds.isError,
    possibleOptionIds.isSuccess,
    setPossibleOptionIds,
  ]);

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
};
