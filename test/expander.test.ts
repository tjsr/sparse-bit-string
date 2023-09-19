import { expandBlock, expandData } from '../src/expander';

import { NumberRange } from "../src/types";

describe('expandBlock', () => {
  test('Should space out missing values', () => {
    const inputArray = [1, 2, 4, 9, 10, 13];
    const missingBlock:NumberRange = [5, 8];
    const expectedOutput = [1, 2, 4, 13, 14, 17];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  })

  test('Should space out missing value on lower bounds', () => {
    const inputArray = [1, 2, 4, 9, 10, 13];
    const missingBlock:NumberRange = [4, 8];
    const expectedOutput = [1, 2, 9, 14, 15, 18];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  });

  test('Should space out missing value on upper bounds', () => {
    const inputArray = [1, 2, 4, 9, 10, 13];
    const missingBlock:NumberRange = [5, 9];
    const expectedOutput = [1, 2, 4, 14, 15, 18];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  });

  test('Should space out missing value in the middle of a block', () => {
    const inputArray = [1, 3, 6];
    const missingBlock:NumberRange = [2, 5];
    const expectedOutput = [1, 7, 10];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  });

  test('Should offset a block from the start', () => {
    const inputArray = [1, 3, 6];
    const missingBlock:NumberRange = [0, 9];
    const expectedOutput = [11, 13, 16];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  });

  test('Should offset a block right on the bounds', () => {
    const inputArray = [0, 3, 6];
    const missingBlock:NumberRange = [0, 9];
    const expectedOutput = [10, 13, 16];
    expect(expandBlock(inputArray, missingBlock)).toStrictEqual(expectedOutput);
  });
});

describe('expandData', () => {
  test('Should expand a block with multiple ranges specified', () => {
    const inputArrayVals = [0, 2, 4, 5,  9, 10, 16, 18, 25, 26, 40,  80];
    const expectedOuptut = [0, 2, 6, 7, 14, 15, 21, 23, 37, 38, 52, 100];
    const missingBlocks: NumberRange[] = [
      [ 3,  4],
      [ 8, 10],
      [24, 30],
      [53, 55],
      [60, 64]
    ];
    expect(expandData(inputArrayVals, missingBlocks)).toStrictEqual(expectedOuptut);
  });
});

describe('extractCompressedBitstring', () => {
  test('Should take a compressed string and extract a range', () => {
    
  })
})
