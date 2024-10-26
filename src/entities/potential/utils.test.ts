import { O } from "~/shared/fp";

import { flattenLevel, getIsResetMethodEnable, parseStat } from "./utils";

describe("flattenLevel", () => {
  it("should return valid result", () => {
    expect(flattenLevel(-1)).toEqual(O.none);
    expect(flattenLevel(0)).toEqual(O.some(9));
    expect(flattenLevel(1)).toEqual(O.some(9));
    expect(flattenLevel(10)).toEqual(O.some(10));
    expect(flattenLevel(11)).toEqual(O.some(19));
    expect(flattenLevel(120)).toEqual(O.some(200));
    expect(flattenLevel(200)).toEqual(O.some(200));
    expect(flattenLevel(201)).toEqual(O.some(250));
    expect(flattenLevel(250)).toEqual(O.some(250));
    expect(flattenLevel(251)).toEqual(O.none);
  });
});

describe("getIsResetMethodEnable", () => {
  it("should return valid result if type is ADDI", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "RARE",
        type: "ADDI",
      }),
    ).toBe(false);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "ADDI",
        grade: "RARE",
        type: "ADDI",
      }),
    ).toBe(true);
  });

  it("should return valid result if type is COMMON", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "ADDI",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(false);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(true);
  });

  it("should return valid result if aimType is GRADE_UP", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "RED",
        grade: "EPIC",
        type: "COMMON",
      }),
    ).toBe(true);

    expect(
      getIsResetMethodEnable({
        aimType: "GRADE_UP",
        resetMethod: "STRANGE",
        grade: "EPIC",
        type: "COMMON",
      }),
    ).toBe(false);
  });

  it("should return valid result if aimType is OPTIONS", () => {
    expect(
      getIsResetMethodEnable({
        aimType: "OPTIONS",
        resetMethod: "RED",
        grade: "RARE",
        type: "COMMON",
      }),
    ).toBe(true);

    expect(
      getIsResetMethodEnable({
        aimType: "OPTIONS",
        resetMethod: "STRANGE",
        grade: "UNIQUE",
        type: "COMMON",
      }),
    ).toBe(false);
  });
});

describe("parseStat", () => {
  it("should return valid result", () => {
    expect(parseStat("STR: +10")).toEqual(O.some({ stat: "STR", figure: 10 }));
    expect(parseStat("STR: +10%")).toEqual(
      O.some({ stat: "STR %", figure: 10 }),
    );
    expect(parseStat("DEX: +15")).toEqual(O.some({ stat: "DEX", figure: 15 }));
    expect(parseStat("INT: +20%")).toEqual(
      O.some({ stat: "INT %", figure: 20 }),
    );
    expect(parseStat("LUK: +25")).toEqual(O.some({ stat: "LUK", figure: 25 }));
    expect(parseStat("최대 HP: +500")).toEqual(
      O.some({ stat: "HP", figure: 500 }),
    );
    expect(parseStat("올스탯: +5%")).toEqual(
      O.some({ stat: "ALL %", figure: 5 }),
    );
    expect(parseStat("공격력: +12")).toEqual(
      O.some({ stat: "ATTACK", figure: 12 }),
    );
    expect(parseStat("마력: +8%")).toEqual(
      O.some({ stat: "MAGIC_ATTACK %", figure: 8 }),
    );
    expect(parseStat("보스 몬스터 공격 시 데미지: +30%")).toEqual(
      O.some({ stat: "BOSS_DAMAGE", figure: 30 }),
    );
    expect(parseStat("몬스터 방어율 무시: +35%")).toEqual(
      O.some({ stat: "IGNORE_DEFENSE", figure: 35 }),
    );
    expect(parseStat("크리티컬 데미지: +8%")).toEqual(
      O.some({ stat: "CRITICAL_DAMAGE", figure: 8 }),
    );
    expect(parseStat("모든 스킬의 재사용 대기시간: -2초")).toEqual(
      O.some({ stat: "COOL_DOWN", figure: 2 }),
    );
    expect(parseStat("캐릭터 기준 9레벨 당 STR: +1")).toEqual(
      O.some({ stat: "STR_PER_9LEV", figure: 1 }),
    );
    expect(parseStat("아이템 드롭률: +20%")).toEqual(
      O.some({ stat: "ITEM_DROP", figure: 20 }),
    );
    expect(parseStat("메소 획득량: +15%")).toEqual(
      O.some({ stat: "MESO_OBTAIN", figure: 15 }),
    );
  });

  it("should return none if invalid stat", () => {
    expect(parseStat("STR")).toEqual(O.none);
    expect(parseStat("잘못된 스탯: +10")).toEqual(O.none);
    expect(parseStat("STR: 10")).toEqual(O.none);
    expect(parseStat("DEX: +abc")).toEqual(O.none);
    expect(parseStat("INT: 20%")).toEqual(O.none);
    expect(parseStat("LUK: +-25")).toEqual(O.none);
    expect(parseStat("최대 MP: +500")).toEqual(O.none);
    expect(parseStat("올스탯: 5%")).toEqual(O.none);
    expect(parseStat("보스 몬스터 공격 시 데미지: 30%")).toEqual(O.none);
    expect(parseStat("몬스터 방어율 무시: 35%")).toEqual(O.none);
    expect(parseStat("크리티컬 데미지: +8")).toEqual(O.none);
    expect(parseStat("모든 스킬의 재사용 대기시간: -2분")).toEqual(O.none);
    expect(parseStat("캐릭터 기준 10레벨 당 STR: +1")).toEqual(O.none);
    expect(parseStat("아이템 드롭률: 20%")).toEqual(O.none);
    expect(parseStat("메소 획득량: +15")).toEqual(O.none);
  });
});
