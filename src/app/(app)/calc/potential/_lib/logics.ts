import { flow, pipe } from "fp-ts/lib/function";
import { concatAll } from "fp-ts/lib/Monoid";

import { Potential } from "~/entities/potential";
import { optionSetMonoid } from "~/entities/potential/utils";
import { type OptionTable } from "~/features/get-potential-data/types";
import { A, O } from "~/shared/fp";
import { entries } from "~/shared/object";

export const getOptionResults = ({
  aimOptionSets,
  optionTableMap,
}: {
  aimOptionSets: Partial<Record<Potential.PossibleStat, number>>[];
  optionTableMap: Map<Potential.ResetMethod, OptionTable[number][number][][]>;
}) =>
  new Map(
    [...optionTableMap.entries()].map(([method, optionTable]) => [
      method,
      getOptionResult({ aimOptionSets, optionTable }),
    ]),
  );

const getOptionResult = ({
  aimOptionSets: _aimOptionSets,
  optionTable,
}: {
  aimOptionSets: Partial<Record<Potential.PossibleStat, number>>[];
  optionTable: (OptionTable[number][number] & {
    name: string;
  })[][];
}): { options: { name: string }[]; prob: number }[] => {
  // console.log("optionTable", optionTable);
  const result: { options: { name: string }[]; prob: number }[] = [];
  type Option = (typeof optionTable)[number][number];
  const currentOptionSet: [
    Option | undefined,
    Option | undefined,
    Option | undefined,
  ] = [undefined, undefined, undefined];
  type StatFigureRecord = Partial<Record<Potential.PossibleStat, number>>;
  const accumulatedStatFigureMap: [StatFigureRecord, StatFigureRecord] = [
    {},
    {},
  ];

  // TODO 리팩토링: concatStatFigureRecord와 하나로 통합
  const aimOptionSets = _aimOptionSets.map(
    flow(
      entries,
      A.filterMap(([stat, _figure]) =>
        pipe(
          O.fromNullable(_figure),
          O.map((figure) => ({ stat, figure })),
        ),
      ),
    ),
  );

  const concatStatFigureRecord = (
    statFigureRecord: StatFigureRecord,
    option: Option,
  ): StatFigureRecord => {
    if (option.stat == null || option.figure == null) {
      return statFigureRecord;
    }

    return concatAll(optionSetMonoid)([
      statFigureRecord,
      { [option.stat]: option.figure },
    ]);
  };

  const isAimAchieved = (statFigureRecord: StatFigureRecord) => {
    return aimOptionSets.some((aimOptionSet) =>
      aimOptionSet.every(
        ({ stat, figure }) => (statFigureRecord[stat] ?? -Infinity) >= figure,
      ),
    );
  };

  const getNextLineOptions = (
    originalOptions: (typeof optionTable)[number],
  ) => {
    const disableNameRegexps = [
      ...Potential.maxOneOptionRegexList.filter(
        (regex) =>
          currentOptionSet.filter((option) => option && regex.test(option.name))
            .length >= 1,
      ),
      ...Potential.maxTwoOptionRegexList.filter(
        (regex) =>
          currentOptionSet.filter((option) => option && regex.test(option.name))
            .length >= 2,
      ),
    ];

    const disabledOptionsInNextLine = originalOptions.filter(({ name }) =>
      disableNameRegexps.some((regex) => regex.test(name)),
    );

    const disabledOptionsTotalProbability = disabledOptionsInNextLine.reduce(
      (acc, { probability }) => acc + probability,
      0,
    );

    return disabledOptionsTotalProbability === 0
      ? originalOptions
      : originalOptions
          .filter(
            ({ name }) =>
              !disabledOptionsInNextLine.some(({ name: n }) => n === name),
          )
          .map(({ probability, ...rest }) => ({
            ...rest,
            probability: probability / (1 - disabledOptionsTotalProbability),
          }));
  };

  const insertOptionToCurrentOptionSet = (index: number, option: Option) => {
    currentOptionSet[index] = option;
  };

  const pushCurrentOptionSetToResults = () => {
    result.push(
      pipe(
        currentOptionSet,
        A.filterMap(O.fromNullable),
        (optionSet) => structuredClone(optionSet),
        (optionSet) => ({
          options: optionSet.map(({ name }) => ({
            name,
          })),
          prob: optionSet.reduce(
            (acc, { probability }) => acc * probability,
            1,
          ),
        }),
      ),
    );
  };

  // 첫번째 줄
  for (const firstLine of optionTable[0]) {
    // console.log("firstline", firstLine.name);
    currentOptionSet[1] = undefined;
    currentOptionSet[2] = undefined;
    accumulatedStatFigureMap[0] = {};
    accumulatedStatFigureMap[1] = {};

    insertOptionToCurrentOptionSet(0, firstLine);
    accumulatedStatFigureMap[0] = concatStatFigureRecord({}, firstLine);

    if (isAimAchieved(accumulatedStatFigureMap[0])) {
      pushCurrentOptionSetToResults();
      continue;
    }

    const secondLineOptions = getNextLineOptions(optionTable[1]);

    // 두번째줄
    for (const secondLine of secondLineOptions) {
      // console.log("secondLine", secondLine.name);
      currentOptionSet[2] = undefined;
      accumulatedStatFigureMap[1] = {};

      insertOptionToCurrentOptionSet(1, secondLine);
      accumulatedStatFigureMap[1] = concatStatFigureRecord(
        accumulatedStatFigureMap[0],
        secondLine,
      );

      if (isAimAchieved(accumulatedStatFigureMap[1])) {
        pushCurrentOptionSetToResults();
        continue;
      }

      const thirdLineOptions = getNextLineOptions(optionTable[2]);

      // 세번째 줄
      for (const thirdLine of thirdLineOptions) {
        // console.log("thirdLine", thirdLine.name);
        insertOptionToCurrentOptionSet(2, thirdLine);

        if (
          isAimAchieved(
            concatStatFigureRecord(accumulatedStatFigureMap[1], thirdLine),
          )
        ) {
          pushCurrentOptionSetToResults();
        }
      }
    }
  }

  return result;
};
