import { pipe } from "fp-ts/lib/function";

import { O } from "./fp";

export const isNumeric = (value: unknown): value is `${number}` => {
  if (typeof value != "string") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !isNaN(value as any) && !isNaN(parseFloat(value));
};

export const convertToNumber = (value: unknown) =>
  pipe(value, O.fromPredicate(isNumeric), O.map(parseFloat));

export const putUnit = (n: number) => {
  if (n === 0) {
    return "0";
  }

  let i;
  const isMinus = n < 0;
  const inputNumber = n < 0 ? -n : n;
  const unsafe = n > Number.MAX_SAFE_INTEGER;
  const unitWords = ["", "만 ", "억 ", "조 ", "경 ", "해 ", "자 "];
  const splitUnit = 10000;
  const splitCount = unitWords.length;
  const resultArray = [];
  let resultString = "";

  for (i = 0; i < splitCount; i++) {
    let unitResult = (inputNumber % splitUnit ** (i + 1)) / splitUnit ** i;
    unitResult = Math.floor(unitResult);
    resultArray[i] = unitResult;
  }

  let largestUnitIndex = 0;
  for (i = resultArray.length - 1; i >= 0; i--) {
    if (resultArray[i] === 0 || (unsafe && i <= largestUnitIndex - 2)) continue;
    if (!largestUnitIndex) {
      largestUnitIndex = i;
    }
    resultString += String(resultArray[i]) + unitWords[i];
  }

  if (resultString.slice(-1)[0] === " ") {
    resultString = resultString.slice(0, -1);
  }

  return `${unsafe ? "약 " : ""}${isMinus ? "-" : ""}${resultString}`;
};
