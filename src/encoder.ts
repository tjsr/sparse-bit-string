import { EncodedString, EncodingSet } from "./types";

import { buildNumberFromFlags } from "./flags";
import { buildSet } from "./common";

export const numberArrayToEncodedString = (input: number[]): EncodedString => {
  if (input === undefined) {
    console.debug('An undefined array was passed in but should not happen.');
    return '';
  }
  if (input.includes(0)) {
    throw Error("Can't have 0 in values list");
  }
  const letters: string[] = buildSet();
  let workingArray: number[] = [...input].sort();
  let outputString = '';
  while (workingArray.length > 0) {
    const tmpArray = workingArray.filter((n) => n <= 6);
    workingArray = workingArray.filter((n) => n > 6).map((n) => n - 6);

    const currentTmpNum = buildNumberFromFlags(tmpArray);
    const currentChar = numberToEncodingChar(currentTmpNum, letters);
    outputString = currentChar + outputString;
  }
  return outputString;
};

export const numberToEncodingChar = (input: number, letters?: EncodingSet): string => {
  if (letters === undefined) {
    letters = buildSet();
  }
  if (input > 63) {
    throw Error('Can not encode character >63');
  }
  return letters[input];
};
