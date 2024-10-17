"use client";

import { createQuery } from "react-query-kit";

import { getPotentialGradeUpRecord, getPotentialOptionTable } from "./actions";

export const useOptionTable = createQuery({
  queryKey: ["potential", "optionTable"],
  fetcher: (variables: Parameters<typeof getPotentialOptionTable>[0]) =>
    getPotentialOptionTable(variables),
});

export const useGradeUpRecord = createQuery({
  queryKey: ["potential", "gradeUpRecord"],
  fetcher: (variables: Parameters<typeof getPotentialGradeUpRecord>[0]) =>
    getPotentialGradeUpRecord(variables),
});

export const PotentialQueries = {
  useOptionTable,
  useGradeUpRecord,
};
