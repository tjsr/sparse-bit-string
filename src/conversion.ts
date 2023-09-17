import { EncodingSet, singleValueToNumber } from "./bitstring";

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

