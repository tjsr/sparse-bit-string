import { EncodingSet } from "./bitstring";
import { parseBase64Number } from "./conversion";

type CompactionHeaderString = string;
type RangePair = [number, number];
type JoinedRangeString = string;
type SingleRangeString = string;
interface CompactionOptions {
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

const splitRangeSetValues = (header: CompactionHeaderString, letters?: EncodingSet): SingleRangeString[] => {
  const rangeMax: number = parseBase64Number(header.substring(0, 2), letters); // 2 chars - 0-4095 ??
  const rangeCount: number = parseBase64Number(header.charAt(2), letters); // 0-63

  const rangeSets: JoinedRangeString = header.substring(3, (rangeMax < 64 ? 1 : 2) * 2 * rangeCount);
  const stringsForSplitting: SingleRangeString[] = getRangeStringsFromSetBlock(rangeSets, rangeCount);
  return stringsForSplitting;
};

export const parseCompactionHeader = (header: CompactionHeaderString, letters?: EncodingSet): CompactionOptions => {
  const rangeMax: number = parseBase64Number(header.substring(0, 2), letters); // 2 chars - 0-4095 ??
  const rangesString: SingleRangeString[] = splitRangeSetValues(header.substring(2))
  const rangePairs: RangePair[] = rangesString.map((pair) => rangePairToValuePair(pair))

  const output: CompactionOptions = {
    maxElementNumber: rangeMax,
    removalRanges: rangePairs
  };
  return output;
};