import { pipe } from "fp-ts/lib/function";
import { values } from "lodash-es";

import { type EffectiveStat, effectiveStatOptions } from "~/entities/stat";
import { O } from "~/shared/fp";
import { loggingIdentity } from "~/shared/function";

import {
  getMethodProbRecord,
  getOptionTable,
  getEfficiencyAdjustedOptionTableRecord,
} from "./logic";

const statEfficiencyRecord = {
  ...effectiveStatOptions.reduce(
    (acc, stat) => ({
      ...acc,
      [stat]: 0,
    }),
    {} as Record<EffectiveStat, number>,
  ),
  STR: 1,
  DEX: 0.1,
  "ALL %": 10,
  ATTACK: 4,
};

describe("getOptionValues", () => {
  it("valid input", () => {
    expect(getOptionTable(100, { isBossDrop: true })("STR")).toEqual(
      O.some([18, 24, 30, 36, 42]),
    );
    expect(getOptionTable(250, { isBossDrop: true })("STR")).toEqual(
      O.some([36, 48, 60, 72, 84]),
    );
    expect(getOptionTable(150, { isBossDrop: true })("STR+DEX")).toEqual(
      O.some([12, 16, 20, 24, 28]),
    );
    expect(getOptionTable(250, { isBossDrop: true })("HP")).toEqual(
      O.some([2100, 2800, 3500, 4200, 4900]),
    );
  });
});

describe("getEfficiencyAdjustedOptionTableRecord", () => {
  it("너무 많아서 log 찍어서 확인", () => {
    expect(
      pipe(
        getEfficiencyAdjustedOptionTableRecord({
          equipLevel: 150,
          statEfficiencyRecord,
          equipType: "WEAPON",
          isBossDrop: true,
        }),
        // loggingIdentity("너무 많아서 log 찍어서 확인"),
        O.isSome,
      ),
    ).toBeTruthy();
  });

  it("방어구일 때 보공, 뎀지는 0", () => {
    pipe(
      getEfficiencyAdjustedOptionTableRecord({
        equipLevel: 150,
        equipType: "NON_WEAPON",
        statEfficiencyRecord,
      }),
      // O.map(loggingIdentity("방어구일 때 보공, 뎀지는 0")),
      O.map((map) => [map.BOSS_DAMAGE_OR_SPEED, map.DAMAGE_OR_JUMP]),
      O.map((arr) =>
        arr.forEach((table) => expect(table).toEqual([0, 0, 0, 0, 0])),
      ),
    );
  });
});

describe("getMethodProbRecord", () => {
  it("일반 input", () => {
    expect(
      pipe(
        getMethodProbRecord({
          equipLevel: 200,
          statEfficiencyRecord,
          equipType: "NON_WEAPON",
          isBossDrop: true,
          aimStat: 100,
        }),
        loggingIdentity("200렙 보스 방어구, 100 스탯 목표"),
      ),
    ).toBeTruthy();
  });

  it("무기일 때 목표가 정해지지 않았으면 undefined", () => {
    expect(
      pipe(
        getMethodProbRecord({
          equipLevel: 200,
          statEfficiencyRecord,
          equipType: "WEAPON",
          isBossDrop: true,
          aimStat: 0,
          weaponGrade: 0,
        }),
        values,
        (arr) => arr.every((item) => item === undefined),
      ),
    ).toBe(true);
  });

  it("무기일 때, 강환불에서 7등급 공격력은 나올 수 없음", () => {
    expect(
      pipe(
        getMethodProbRecord({
          equipLevel: 200,
          statEfficiencyRecord,
          equipType: "WEAPON",
          isBossDrop: true,
          aimStat: 0,
          weaponGrade: 7,
        }),
        values,
        O.some,
        O.filter((arr) => arr[0] === 0),
        O.filter((arr) => arr[1] !== 0),
        O.match(
          () => false,
          () => true,
        ),
      ),
    ).toBe(true);
  });

  it("무기는 공추옵만 정해도 계산 가능", () => {
    expect(
      pipe(
        getMethodProbRecord({
          equipLevel: 200,
          statEfficiencyRecord,
          equipType: "WEAPON",
          isBossDrop: true,
          aimStat: 0,
          weaponGrade: 6,
        }),
        loggingIdentity("보스템 200렙 무기, 0 스탯 2추 목표"),
        values,
        O.some,
        O.filter((arr) => !arr.every((item) => item === undefined)),
        O.match(
          () => false,
          () => true,
        ),
      ),
    ).toBe(true);
  });

  it("무기일 때 환산스탯이 제대로 계산돼야 됨", () => {
    expect(
      pipe(
        O.Do,
        O.bind("first", () =>
          pipe(
            getMethodProbRecord({
              equipLevel: 200,
              statEfficiencyRecord,
              equipType: "WEAPON",
              isBossDrop: true,
              aimStat: 0,
              weaponGrade: 6,
            }),
            loggingIdentity("보스템 200렙 무기, 0 스탯 2추 목표"),
            values,
            O.some,
          ),
        ),
        O.bind("second", () =>
          pipe(
            getMethodProbRecord({
              equipLevel: 200,
              statEfficiencyRecord,
              equipType: "WEAPON",
              isBossDrop: true,
              aimStat: 10,
              weaponGrade: 6,
            }),
            loggingIdentity("보스템 200렙 무기, 10 스탯 2추 목표"),
            values,
            O.some,
          ),
        ),
        O.filter(({ first, second }) => first[0] !== second[0]),
        O.match(
          () => false,
          () => true,
        ),
      ),
    ).toBeTruthy();
  });
});
