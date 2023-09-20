import { CompactionOptions, generateHeaderString } from "./compactionHeader";
import { CompressedBitArrayWithHeader, NumberRange } from "./types";
import { EncodedString, numberArrayToEncodedString } from "./bitstring";

export const compactRange = (inputNumbers:number[], inputRemoveRange: NumberRange): number[] => {
  const removeLower: number = inputRemoveRange[0];
  const removeUpper: number = inputRemoveRange[1];
  if (removeLower >= removeUpper) {
    throw new Error('Lower must be less than upper');
  }
  if (removeLower === 0) {
    throw new Error("Can't specify 0 in range to be excluded");
  }
  if (inputNumbers.includes(0)) {
    throw new Error("Can't have 0 in values list");
  }
  const removeRange = removeUpper - removeLower+1;
  const output: number[] = [...inputNumbers];
  for (let i = 0;i < output.length;i++) {
    if (output[i] >= removeLower && output[i] <= removeUpper) {
      throw new Error(`Can't compact when values exist inside given range: ${output[i]} is between ${removeLower}-${removeUpper}`);
    }
    if (output[i] > removeLower) {
      output[i] = output[i] - removeRange;
    }
  }
  return output;
}

export const removeRanges = (inputNumbers:number[], ranges: NumberRange[]): number[] => {
  if (ranges.length > 1) {
    for (let i = 1;i < ranges.length;i++) {
      if (ranges[i-1][0] >= ranges[i][0]) {
        throw new Error("Removal ranges must be provided in order");
      }
      if (ranges[i-1][1] >= ranges[i][1]) {
        throw new Error("Removal ranges must be provided in order");
      }
    }
  }

  let outputNumbers = [...inputNumbers];
  for (let i = ranges.length-1;i >= 0;i--) {
    outputNumbers = compactRange(outputNumbers, ranges[i]);
  }

  return outputNumbers;
};

const checkRangeForValidRemovableBlocks = (inputNumbers: number[], range:NumberRange): boolean => {
  const invalidNumbers = inputNumbers.filter((n) => n >= range[0] && n <= range[1]);
  if (invalidNumbers.length > 0) {
    throw new Error(`Can't compact list because values ${JSON.stringify(invalidNumbers)} are between ${range[0]}-${range[1]}`);
  }
  return true;
};

const checkRangesForValidRemovableBlocks = (inputNumbers: number[], missingBlocks:NumberRange[]): boolean => {
  return missingBlocks.every((range) => checkRangeForValidRemovableBlocks(inputNumbers, range));
};

export const generateCompressedStringWithHeader = (inputNumbers: number[], missingBlocks?:NumberRange[]): CompressedBitArrayWithHeader => {
  const max = inputNumbers.length > 0 ? inputNumbers.reduce((max, current) => current > max ? current : max) : 0;
  const header: CompactionOptions = {
    maxElementNumber: max,
    removalRanges: missingBlocks || []
  };
  checkRangesForValidRemovableBlocks(inputNumbers, header.removalRanges);
  
  const headerString: string = generateHeaderString(header);
  const revisedRange: number[] = removeRanges(inputNumbers, header.removalRanges);
  const encodedString: EncodedString = numberArrayToEncodedString(revisedRange);
  return `${headerString}${encodedString}`;
};
