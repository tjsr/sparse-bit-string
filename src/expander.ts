import { NumberRange } from "./types";

export const expandBlock = (inputValues: number[], range: NumberRange): number[] => {
  const currentAdd: number = range[1] - range[0] + 1;
  return inputValues.map((value: number) => value >= range[0] ? value + currentAdd : value);
};

export const expandData = (inputValues: number[], removedRanges: NumberRange[]): number[] => {
  let outputData: number[] = [...inputValues];

  removedRanges.forEach((range: NumberRange) => {
    outputData = expandBlock(outputData, range);
  });
  return outputData;
};