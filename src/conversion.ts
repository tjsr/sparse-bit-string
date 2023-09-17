import { EncodingSet, numberToEncodingChar, singleValueToNumber } from "./bitstring";

export const parseBase64Number = (input: string, letters?: EncodingSet): number => {
  const partValues: number[] = input.split('')
    .map((v) => singleValueToNumber(v, letters));

  let output = 0;
  let base = 1;
  for (let i = partValues.length-1;i >= 0;i--) {
    output = output + (base * partValues[i]);
    base = base * 64;
  }
  return output;
};

export const convertNumberToBase64 = (input: number, padLength?: number, letters?: EncodingSet): string => {
  let output = "";
  while (input > 0 || (padLength !== undefined && output.length < padLength)) {
    const remainder = input % 64;
    const currentChar = numberToEncodingChar(remainder, letters);
    input = input - (input % 64);
    input = input / 64;
    output = currentChar + output;
  }
  return output;
};