"use client";

import { createScope, molecule, type MoleculeConstructor } from "bunshi";
import { pipe } from "fp-ts/lib/function";
import { atom } from "jotai";
import { z } from "zod";

import { type Starforce } from "~/entities/starforce";
import { E, O } from "~/shared/fp";
import { convertToNumber } from "~/shared/number";
import { type FormPayload } from "~/shared/react";
import { parseZodWithErrorMessage } from "~/shared/zod";

export const StarforceSimulatorScope = createScope(undefined, {
  debugLabel: "starforce/sim",
});

const starforceSimulatorMoleculeConstructor = ((_, scope) => {
  scope(StarforceSimulatorScope);

  const _levelAtom = atom<FormPayload<number>>({
    input: "",
    value: E.left("레벨을 입력해주세요."),
  });
  const levelAtom = atom(
    (get) => get(_levelAtom),
    (get, set, input: string) => {
      set(_levelAtom, {
        input,
        value: pipe(
          convertToNumber(input),
          O.toNullable,
          parseZodWithErrorMessage(
            z
              .number({ message: "레벨을 입력해주세요." })
              .int({ message: "정수를 입력해주세요." })
              .min(0, {
                message: "0 이상의 값을 입력해주세요.",
              })
              .max(300, {
                message: "300 이하의 값을 입력해주세요.",
              }),
          ),
        ),
      });
    },
  );

  const _spareCostAtom = atom<FormPayload<number>>({
    input: "",
    value: E.of(0),
  });
  const spareCostAtom = atom(
    (get) => get(_spareCostAtom),
    (get, set, input: string) => {
      set(_spareCostAtom, {
        input,
        value: pipe(
          convertToNumber(input || 0),
          O.toNullable,
          parseZodWithErrorMessage(
            z.number({ message: "올바른 값을 입력해주세요." }),
          ),
        ),
      });
    },
  );

  const _currentStarforce = atom<FormPayload<number>>({
    input: "",
    value: E.of(0),
  });
  const currentStarforce = atom(
    (get) => get(_currentStarforce),
    (get, set, input: string) => {
      set(_currentStarforce, {
        input,
        value: pipe(
          convertToNumber(input || 0),
          O.toNullable,
          parseZodWithErrorMessage(
            z
              .number({ message: "올바른 값을 입력해주세요." })
              .int({
                message: "정수를 입력해주세요.",
              })
              .min(0, {
                message: "0 이상의 값을 입력해주세요.",
              })
              .max(24, {
                message: "24 이하의 값을 입력해주세요.",
              }),
          ),
        ),
      });
    },
  );

  const _targetStarforce = atom<FormPayload<number>>({
    input: "",
    value: E.of(0),
  });
  const targetStarforce = atom(
    (get) => get(_currentStarforce),
    (get, set, input: string) => {
      const currentStarforce = pipe(
        get(_currentStarforce).value,
        E.getOrElse(() => 0),
      );

      set(_targetStarforce, {
        input,
        value: pipe(
          convertToNumber(input || 0),
          O.toNullable,
          parseZodWithErrorMessage(
            z
              .number({ message: "올바른 값을 입력해주세요." })
              .int({
                message: "정수를 입력해주세요.",
              })
              .min(0, {
                message: "0 이상의 값을 입력해주세요.",
              })
              .min(currentStarforce + 1, {
                message: "현재 스타포스보다 높은 값을 입력해주세요.",
              })
              .max(25, {
                message: "25 이하의 값을 입력해주세요.",
              }),
          ),
        ),
      });
    },
  );

  // 시뮬레이션 횟수
  const _simulationCountAtom = atom<FormPayload<number>>({
    input: "100000",
    value: E.of(100000),
  });
  const simulationCountAtom = atom(
    (get) => get(_simulationCountAtom),
    (get, set, input: string) => {
      set(_simulationCountAtom, {
        input,
        value: pipe(
          convertToNumber(input),
          O.toNullable,
          parseZodWithErrorMessage(
            z
              .number({ message: "올바른 값을 입력해주세요." })
              .int({
                message: "정수를 입력해주세요.",
              })
              .min(1, {
                message: "1 이상의 값을 입력해주세요.",
              })
              .max(1000000, {
                message: "100만 이하의 값을 입력해주세요.",
              }),
          ),
        ),
      });
    },
  );

  const safeGuardRecordAtom = atom<{ [key: number]: boolean }>({
    15: false,
    16: false,
  });

  const starcatchRecordAtom = atom<{ [key: number]: boolean }>(
    Array.from({ length: 25 }).reduce<{ [key: number]: boolean }>(
      (acc, _, i) => ({ ...acc, [i]: false }),
      {},
    ),
  );

  const eventAtom = atom<Starforce.Event | null>(null);

  const discountAtom = atom<Starforce.Discount[]>([]);

  return {
    levelAtom,
    spareCostAtom,
    currentStarforce,
    targetStarforce,
    simulationCountAtom,
    safeGuardRecordAtom,
    starcatchRecordAtom,
    eventAtom,
    discountAtom,
  };
}) satisfies MoleculeConstructor<unknown>;

export const StarforceSimulatorMolecule = molecule(
  starforceSimulatorMoleculeConstructor,
);

export type StarforceSimulatorMoleculeStructure = ReturnType<
  typeof starforceSimulatorMoleculeConstructor
>;
