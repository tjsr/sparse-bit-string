import { convertNumberToBase64, parseBase64Number } from "./conversion";

import { EncodingSet } from "./bitstring";

type CompactionHeaderString = string;
type RangePair = [number, number];
type JoinedRangeString = string;
type SingleRangeString = string;
export interface CompactionOptions {
  maxElementNumber: number,
  removalRanges: RangePair[],
}

export const createHeader = (): CompactionHeaderString => {
  return 'xyyy';
};

// const getBytesPerValue = (range: string): number => {
//   return 2;
// };

export const getRangeStringsFromSetBlock = (rangeSetsString: JoinedRangeString, numberOfRanges: number): SingleRangeString[] => {
  const outputStrings: SingleRangeString[] = [];
  if ((rangeSetsString.length / numberOfRanges) % 2 !== 0) {
    throw new Error('Each range must have the same number of characters for upper and lower bounds');
  }
  const lengthPerRange: number = rangeSetsString.length / numberOfRanges;

  while (rangeSetsString.length > 0) {
    const currentString: SingleRangeString = rangeSetsString.substring(0, lengthPerRange);
    outputStrings.push(currentString);
    rangeSetsString = rangeSetsString.substring(lengthPerRange);
  }
  return outputStrings;
}

export const rangePairToValuePair = (rangeSetPair: string): RangePair => {
  if (rangeSetPair.length % 2 !== 0) {
    throw new Error('Each range must have the same number of characters for upper and lower bounds');
  }
  const firstValueString: string = rangeSetPair.substring(0, rangeSetPair.length / 2);
  const secondValueString: string = rangeSetPair.substring(rangeSetPair.length / 2);
  return [parseBase64Number(firstValueString), parseBase64Number(secondValueString)];
}

const splitRangeSetValues = (header: CompactionHeaderString, rangeChars: number, letters?: EncodingSet): SingleRangeString[] => {
  const rangeMax: number = parseBase64Number(header.substring(0, rangeChars), letters); // 2 chars - 0-4095 ??
  const rangeCount: number = parseBase64Number(header.charAt(rangeChars), letters); // 0-63

  const rangeSets: JoinedRangeString = header.substring(rangeChars+1, rangeChars + 1 + ((rangeMax < 64 ? 1 : 2) * 2 * rangeCount));
  const foundRanges = rangeSets.length / ((rangeMax < 64 ? 1 : 2) * 2);
  if (rangeSets.length !== (rangeMax < 64 ? 1 : 2) * 2 * rangeCount) {
    throw new Error(`Expected ${rangeCount} number ranges but only found ${foundRanges}`);
  }

  const stringsForSplitting: SingleRangeString[] = getRangeStringsFromSetBlock(rangeSets, rangeCount);
  return stringsForSplitting;
};

export const parseCompactionHeader = (header: CompactionHeaderString, letters?: EncodingSet): CompactionOptions => {
  const rangeChars: number = 2;
  const rangeMax: number = parseBase64Number(header.substring(0, rangeChars), letters); // 2 chars - 0-4095 ??
  const rangeCharString = header.substring(rangeChars+1);
  console.log(rangeCharString);
  const rangesString: SingleRangeString[] = splitRangeSetValues(header, rangeChars);
  const rangePairs: RangePair[] = rangesString.map((pair) => rangePairToValuePair(pair))

  const output: CompactionOptions = {
    maxElementNumber: rangeMax,
    removalRanges: rangePairs
  };
  return output;
};

export const getHeaderLength = (header: CompactionOptions): number => {
  const charsPerRangeItem = header.maxElementNumber < 64 ? 1 : 2;
  return 2 + 1 + (charsPerRangeItem * 2 * header.removalRanges.length);
};

const convertPairToString = (pair: RangePair, rangeSize: number): string => {
  return convertNumberToBase64(pair[0], rangeSize) + convertNumberToBase64(pair[1], rangeSize);
}

const getRangesString = (pairs: RangePair[], rangeSize: number): string => {
  return pairs.map((pair) => convertPairToString(pair, rangeSize)).join("");
};

export const generateHeaderString = (header: CompactionOptions): string => {
  const maxElementChar = convertNumberToBase64(header.maxElementNumber, 2);
  const rangesChar = convertNumberToBase64(header.removalRanges.length);
  const rangesString = getRangesString(header.removalRanges, header.maxElementNumber > 64 ? 2 : 1);
  return maxElementChar + rangesChar + rangesString;
};