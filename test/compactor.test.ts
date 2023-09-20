import { compactRange, generateCompressedStringWithHeader, removeRanges } from '../src/compactor';

describe('compactRange', () => {
  test('Should remove empty values from a range', () => {
    const input: number[] = [
      1, 2, 4, 9, 13, 17
    ];
    const expectedOutput: number[] = [
      1, 2, 4, 5, 9, 13
    ];
    const output: number[] = compactRange(input, [5, 8]);
    expect(output).toEqual(expectedOutput);
  });

  test('Should throw an error if the array contains a number in the range', () => {
    const run1 = () => {
      const input: number[] = [
        1, 2, 4, 5, 9, 13, 17
      ];
      compactRange(input, [5, 8]);
    };

    const run2 = () => {
      const input: number[] = [
        1, 2, 4, 8, 9, 13, 17
      ];
      compactRange(input, [5, 8]);
    };

    const run3 = () => {
      const input: number[] = [
        1, 2, 4, 7, 9, 13, 17
      ];
      compactRange(input, [5, 8]);
    };

    expect(run1).toThrow("Can't compact when values exist inside given range");
    expect(run2).toThrow("Can't compact when values exist inside given range");
    expect(run3).toThrow("Can't compact when values exist inside given range");
  });

  test('Must have upper value higher than lower', () => {
    const input: number[] = [
      1, 2, 4, 9, 13, 17
    ];
    const run1 = () => {
      compactRange(input, [5, 5]);
    };
    const run2 = () => {
      compactRange(input, [5, 4]);
    };
    const run3 = () => {
      compactRange(input, [10, 5]);
    };
    expect(run1).toThrow("Lower must be less than upper");
    expect(run2).toThrow("Lower must be less than upper");
    expect(run3).toThrow("Lower must be less than upper");
  });
});

describe('removeRanges', () => {
  test('Should throw an error if ranges are given out of order', () => {
    const run1 = () => {
      const input: number[] = [
        1, 2, 4, 5, 9, 13, 17, 18, 25, 26, 29
      ];
      removeRanges(input, [[19, 24], [5, 8]]);
    };
    expect(run1).toThrow("Removal ranges must be provided in order");
  });

  test('Should remove a single number range from output', () => {
    const input: number[] = [
      1, 2, 4, 9, 13, 17
    ];
    const expectedOutput: number[] = [
      1, 2, 4, 5, 9, 13
    ];
    const output: number[] = removeRanges(input, [[5, 8]]);
    expect(output).toEqual(expectedOutput);
  });

  test('Should remove multiple number ranges from output', () => {
    const input: number[] = [
      1, 2, 4, 13, 17, 18, 25, 26, 29
    ];
    const expectedOutput: number[] = [
      1, 2, 4, 9, 13, 14, 15, 16, 17
    ];
    const output: number[] = removeRanges(input, [[5, 8], [19, 24], [27, 28]]);
    expect(output).toEqual(expectedOutput);
  });
});

describe('createCompressedStringWithHeader', () => {
  test('Should create output string', () => {
    const inputRange1 = [77,102,108,242,437,664,666,727,778,786,826,854,1026,1274,1275,1276,1277,1278,1279,1280,1308,1311,1312,1324,1326,1336,1337,1338,1339];
    const removeRange1a: [number,number][] = [[1,76],[109,241],[438,663],[667,726],[787,825],[855,1025]];
    const removeRange1b: [number, number][] = [[1, 76], [109, 241], [243, 436], [438, 663], [667, 726], [728, 777],
    [787, 825], [855, 1025], [1027, 1273]];

    const outputString1a = generateCompressedStringWithHeader(inputRange1, removeRange1a);
    const expectedOutputString1a = "U7GABBMBtDxG2KXKbLWMTM5NXQBPAFABkAAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAMBAAAAAAAANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGCAAAB";
    expect(outputString1a).toEqual(expectedOutputString1a);
    const outputString1b = generateCompressedStringWithHeader(inputRange1, removeRange1b);
    const expectedOutputString1b = "U7JABBMBtDxDzG0G2KXKbLWLYMJMTM5NXQBQDT5eAKADIAAAA-4AAAAwHeCAAAB";
    expect(outputString1b).toEqual(expectedOutputString1b);

    const inputRange2 = [813,814,815,817,819,820,821,822,897,898,899,900];
    const removeRange2: [number, number][] = [[1,812],[823,896]];
    const outputString2 = generateCompressedStringWithHeader(inputRange2, removeRange2);
    const expectedOutputString2 = "OECABMsM3OAD-X";
    expect(outputString2).toEqual(expectedOutputString2);
  });
});