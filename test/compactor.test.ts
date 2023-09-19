import { compactRange, removeRanges } from '../src/compactor';

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