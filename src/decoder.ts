import { EncodedString, EncodingSet } from "./types";

import { buildSet } from "./common";

export const singleValueToNumber = (value: string, letters?: EncodingSet): number => {
  return (letters || buildSet()).findIndex((arrValue) => arrValue == value);
};

export const letterToNumbers = (str: string, letters?: EncodingSet): number[] => {
  if (letters == undefined) {
    letters = buildSet();
  }

  const output: number[] = [];
  let value: number = letters.indexOf(str.charAt(str.length-1));
  for (let add = 1;add <= 6;add++) {
    if (value & 1) {
      output.push(add);
    }
    value = value >> 1;
  }
  return output;
};

export const stringToNumberArray = (str: EncodedString, letters?: EncodingSet): number[] => {
  if (letters == undefined) {
    letters = buildSet();
  }

  const output: number[] = [];
  const inputArray = str.split('');

  let offset = 1;
  for (let idx = inputArray.length-1;idx >= 0;idx--) {
    const v = inputArray[idx];
    let parts: number[] = letterToNumbers(v, letters);
    parts = parts.map((n) => n + offset - 1);

    parts.forEach((n) => {
      output.push(n);
    });
    offset += 6;
  }

  return output;
};