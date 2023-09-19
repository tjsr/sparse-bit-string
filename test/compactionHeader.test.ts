import { CompactionOptions, generateHeaderString, getHeaderLength, getRangeStringsFromSetBlock, parseCompactionHeader, rangePairToValuePair } from '../src/compactionHeader';

import { NumberRange } from '../src/types';
import { generatedCompressedStringWithHeader } from '../src/compactor';
import { stringToNumberArray } from '../src/decoder';

describe('Should extract elements from compaction strings', () => {
  test('Should break open a single element', () => {
    expect(getRangeStringsFromSetBlock("ABCD", 1)).toEqual(["ABCD"]);
  });
  test('Should break open multiple elements', () => {
    expect(getRangeStringsFromSetBlock("ABCD", 2)).toEqual(["AB", "CD"]);
    expect(getRangeStringsFromSetBlock("ABCDEF", 3)).toEqual(["AB", "CD", "EF"]);
    expect(getRangeStringsFromSetBlock("ABCDEFGH", 4)).toEqual(["AB", "CD", "EF", "GH"]);
    expect(getRangeStringsFromSetBlock("ABCDEFGH", 2)).toEqual(["ABCD", "EFGH"]);
  });
  
  test('Should reject a range with invalid range value sizes', () => {
    const testRun = () => {
      getRangeStringsFromSetBlock("ABCDEF", 2)
    };

    expect(testRun).toThrow("Each range must have the same number of characters for upper and lower bounds");
  });
});

describe('rangePairToValuePair', () => {
  test('Should extract most basic pair', () => {
    expect(rangePairToValuePair("BC")).toEqual([1, 2]);
    expect(rangePairToValuePair("C8")).toEqual([2, 60]);
  });

  test('Should extract larger numbers', () => {
    expect(rangePairToValuePair("AAAB")).toEqual([0, 1]);
    expect(rangePairToValuePair("ABAC")).toEqual([1, 2]);
    expect(rangePairToValuePair("AAHM")).toEqual([0, 460]);
    expect(rangePairToValuePair("ABCACD")).toEqual([66, 131]);
  });

  test('Expect an exception if an unbalanced pair is given', () => {
    const testRun = () => {
      getRangeStringsFromSetBlock("ABCDE", 2)
    };
  
    expect(testRun).toThrow("Each range must have the same number of characters for upper and lower bounds");
  });
});

describe('parseCompactionHeader', () => {
  test('Should return a header for a typical range set with some values removed', () => {
    const options: CompactionOptions = parseCompactionHeader("f7DAAHMIANwQLZr");
    expect(options.maxElementNumber).toBe(2043);
  });
});

describe('getHeaderLength', () => {
  test ('Should verify number of characters expected for a given header', () => {
    const testHeader: CompactionOptions = {
      maxElementNumber: 2043,
      removalRanges: [[0, 460],
        [512, 880],
        [1035, 1643]
      ]
    };
    expect(getHeaderLength(testHeader)).toBe(15);
  });
});

describe('generateHeaderString', () => {
  test ('Should generate a valid header from options', () => {
    const testHeader: CompactionOptions = {
      maxElementNumber: 2043,
      removalRanges: [[0, 460],
        [512, 880],
        [1035, 1643]
      ]
    };
    expect(generateHeaderString(testHeader)).toBe("f7DAAHMIANwQLZr");
  });
});

describe('generatedCompressedStringWithHeader', () => {
  const expectedPayload = "CAAAAAAIADAoMa";
  const expectedCompressedVals = [2, 4, 5,  9, 10, 16, 18, 25, 26, 40,  80];
  const inputArrayVals = [2, 6, 7, 14, 15, 21, 23, 37, 38, 52, 100];
  test('Should get compacted Bit String', () => {
    const missingBlocks: NumberRange[] = [
      [ 3,  4],
      [ 8, 10],
      [24, 30],
      [53, 55],
      [60, 64]
    ];

    const header  = "BkFADAEAIAKAYAeA1A3A8BA"
    const output = generatedCompressedStringWithHeader(inputArrayVals, missingBlocks)
    expect(output).toBe(header + expectedPayload);
  });

  test('Should reject passing 0 as first value in range', () => {
    const inputArrayVals = [2, 6, 7];

    const missingBlocks: NumberRange[] = [
      [ 0,  1]
    ];

    const run = () => {
      generatedCompressedStringWithHeader(inputArrayVals, missingBlocks);
    };

    expect(run).toThrow("Can't specify 0 in range to be excluded");
  });

  test('Should verify test string from above expands to value without ranges removed', () => {
    expect(stringToNumberArray(expectedPayload)).toStrictEqual(expectedCompressedVals);
  });

  test('Should reject a 0 being included in the encoding range', () => {
    const run1 = () => {
      const inputArrayVals = [0, 2, 6, 7];

      const missingBlocks: NumberRange[] = [
        [ 3,  4]
      ];
      generatedCompressedStringWithHeader(inputArrayVals, missingBlocks);
    };
    expect(run1).toThrow("Can't have 0 in values list");
  });
});
