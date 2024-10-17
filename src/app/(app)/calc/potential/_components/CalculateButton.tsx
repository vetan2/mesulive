"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMolecule } from "bunshi/react";
import { identity, pipe } from "fp-ts/lib/function";
import { type Option } from "fp-ts/lib/Option";
import { useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { overlay } from "overlay-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { P, match } from "ts-pattern";

import { type getOptionResults } from "~/app/(app)/calc/potential/_lib/logics";
import { PotentialCalcMolecule } from "~/app/(app)/calc/potential/_lib/molecules";
import { type Potential } from "~/entities/potential";
import { flattenLevel } from "~/entities/potential/utils";
import { effectiveStatSchema } from "~/entities/stat";
import { PotentialQueries } from "~/features/get-potential-data/queries";
import { type GradeUpRecord } from "~/features/get-potential-data/types";
import { A, E, O, TO } from "~/shared/fp";
import { type AtomValue } from "~/shared/jotai";
import { cx } from "~/shared/style";
import { S } from "~/shared/ui";

import { ResultModal } from "./ResultModal";

interface Props {
  className?: string;
}

export const CalculateButton = ({ className }: Props) => {
  const queryClient = useQueryClient();
  const worker = useRef<Worker>();

  const {
    inputStatusAtom,
    isPendingForPossibleOptionIdsAtom,
    resetMethodsAtom,
    aimTypeAtom,
    gradeAtom,
    equipAtom,
    levelAtom,
    optionSetsAtom,
    resultAtom,
  } = useMolecule(PotentialCalcMolecule);
  const inputStatus = useAtomValue(inputStatusAtom);
  const isPendingForPossibleOptionIds = useAtomValue(
    isPendingForPossibleOptionIdsAtom,
  );
  const isDisabled = E.isLeft(inputStatus) || isPendingForPossibleOptionIds;

  const [isLoading, setIsLoading] = useState(false);

  const fetchGradeUpRecord = useAtomCallback(
    useCallback(
      (get) => {
        const methods = get(resetMethodsAtom);
        const grade = get(gradeAtom);

        return TO.tryCatch(() =>
          Promise.all(
            methods.map((method) =>
              queryClient
                .fetchQuery(
                  PotentialQueries.useGradeUpRecord.getFetchOptions({
                    method,
                    grade,
                  }),
                )
                .then((result) => ({ method, record: result })),
            ),
          ),
        )();
      },
      [gradeAtom, queryClient, resetMethodsAtom],
    ),
  );

  const fetchPotentialData = useAtomCallback(
    useCallback(
      (get) => {
        return pipe(
          TO.of({
            methods: get(resetMethodsAtom),
            grade: get(gradeAtom),
            equip: get(equipAtom),
          }),
          TO.apS(
            "level",
            pipe(
              get(levelAtom).value,
              TO.fromEither,
              TO.chainOptionK(flattenLevel),
            ),
          ),
          TO.bind(
            "optionTable",
            TO.tryCatchK(({ methods, grade, equip, level }) =>
              Promise.all(
                methods.map((method) =>
                  queryClient
                    .fetchQuery(
                      PotentialQueries.useOptionTable.getFetchOptions({
                        equip,
                        grade,
                        level,
                        method,
                      }),
                    )
                    .then(
                      (result) =>
                        [
                          method,
                          pipe(
                            result,
                            A.map(
                              A.map(({ probability, stat, id, ...others }) => ({
                                probability,
                                ...others,
                                stat: effectiveStatSchema
                                  .optional()
                                  .parse(stat),
                              })),
                            ),
                          ),
                        ] as const,
                    ),
                ),
              ).then((entries) => new Map(entries)),
            ),
          ),
        )();
      },
      [equipAtom, gradeAtom, levelAtom, queryClient, resetMethodsAtom],
    ),
  );

  const openResultModal = useAtomCallback(
    useCallback(
      (get) => {
        const level = get(levelAtom).value;
        if (E.isLeft(level)) {
          // TODO display error modal
          return;
        }
        const grade = get(gradeAtom);
        const aimType = get(aimTypeAtom);

        overlay.open(({ isOpen, close, unmount }) => (
          <ResultModal
            isOpen={isOpen}
            onClose={close}
            onExit={unmount}
            resultAtom={resultAtom}
            grade={grade}
            level={level.right}
            aimType={aimType}
          />
        ));
      },
      [aimTypeAtom, gradeAtom, levelAtom, resultAtom],
    ),
  );

  const calcGradeUp = useAtomCallback(
    useCallback(
      (
        get,
        set,
        gradeUpRecord: {
          method: Potential.ResetMethod;
          record?: GradeUpRecord;
        }[],
      ) => {
        set(
          resultAtom,
          pipe(
            gradeUpRecord,
            A.filterMap((e) =>
              match(e)
                .returnType<Option<AtomValue<typeof resultAtom>[number]>>()
                .with({ record: P.nonNullable }, ({ method, record }) =>
                  O.some({
                    method,
                    prob: record.probability,
                    ceil: record.ceil,
                  }),
                )
                .otherwise(() => O.none),
            ),
          ),
        );
        setIsLoading(false);
        openResultModal();
      },
      [openResultModal, resultAtom],
    ),
  );

  const startOptionCalc = useAtomCallback(
    useCallback(
      async (
        get,
        set,
        optionTableMap: Parameters<
          typeof getOptionResults
        >[0]["optionTableMap"],
      ) => {
        const aimOptionSets = get(optionSetsAtom);
        if (!worker.current) {
          return;
        }
        worker.current.onmessage = (
          event: MessageEvent<ReturnType<typeof getOptionResults>>,
        ) => {
          const calcResult = [...event.data.entries()].map(
            ([method, result]) => ({
              method,
              prob: result.reduce((acc, { prob }) => acc + prob, 0),
              optionResults: result,
            }),
          );
          set(resultAtom, calcResult);
          setIsLoading(false);
          openResultModal();
        };
        worker.current.postMessage({ aimOptionSets, optionTableMap });
      },
      [openResultModal, optionSetsAtom, resultAtom],
    ),
  );

  const handleClick = useAtomCallback(
    useCallback(
      (get) => {
        const aimType = get(aimTypeAtom);
        setIsLoading(true);

        switch (aimType) {
          case "GRADE_UP":
            fetchGradeUpRecord().then((result) => {
              if (O.isSome(result)) {
                calcGradeUp(result.value);
              }
            });
            break;
          case "OPTIONS":
            fetchPotentialData().then((result) => {
              if (O.isSome(result)) {
                startOptionCalc(result.value.optionTable);
              }
            });
            break;
        }
      },
      [
        aimTypeAtom,
        calcGradeUp,
        fetchGradeUpRecord,
        fetchPotentialData,
        startOptionCalc,
      ],
    ),
  );

  useEffect(() => {
    worker.current = new Worker(
      new URL(
        "~/app/(app)/calc/potential/_lib/workers/getOptionResults.ts",
        import.meta.url,
      ),
    );
  }, []);

  return (
    <S.Tooltip
      content={pipe(
        inputStatus,
        E.match(identity, () => undefined),
      )}
      isDisabled={E.isRight(inputStatus)}
    >
      <S.Button
        size="lg"
        color={isDisabled ? "default" : "primary"}
        className={cx("flex justify-center font-bold", className)}
        isDisabled={isDisabled || isLoading}
        isLoading={isLoading}
        onClick={() => {
          handleClick();
        }}
      >
        계산하기
      </S.Button>
    </S.Tooltip>
  );
};
