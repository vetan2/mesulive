"use client";

import { useState } from "react";

import {
  getPotentialGradeUpRecord,
  getPotentialOptionTable,
} from "~/features/get-potential-data/actions";
import { S } from "~/shared/ui";

const optionParam: Parameters<typeof getPotentialOptionTable>[0] = {
  method: "POTENTIAL",
  equip: "펜던트",
  level: 160,
  grade: "LEGENDARY",
};

const gradeUpParam: Parameters<typeof getPotentialGradeUpRecord>[0] = {
  method: "ADDI",
  currentGrade: "RARE",
};

export const TestButton = () => {
  const [html, setHtml] = useState("");
  return (
    <div>
      <S.Button
        onClick={async () => {
          console.time("fetch");
          const record = await getPotentialGradeUpRecord(gradeUpParam);

          console.table(record);
          // setHtml(html ?? "");
          console.timeEnd("fetch");

          // setStr(html);
          // setData(JSON.parse(data));
        }}
      >
        큐브 등급업
      </S.Button>
      <S.Button
        onClick={async () => {
          console.time("fetch");
          const table = await getPotentialOptionTable(optionParam);

          console.table(table);
          // setHtml(html ?? "");
          console.timeEnd("fetch");

          // setStr(html);
          // setData(JSON.parse(data));
        }}
      >
        큐브 옵션
      </S.Button>
      <div>{html}</div>
    </div>
  );
};
