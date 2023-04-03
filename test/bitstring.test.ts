import { buildNumberFromFlags, buildSet, letterToNumbers, numberArrayToEncodedString, numberToEncodingChar, stringToNumberArray } from "../src/bitstring";

describe('stringToNumberArray', () => {
  const letters: string[] = buildSet();
  test('Should convert single character from list', () => {
    expect(stringToNumberArray('r', letters)).toEqual([1, 2, 4, 6]);
    expect(stringToNumberArray('A', letters)).toEqual([]);
    expect(stringToNumberArray('B', letters)).toEqual([1]);
    expect(stringToNumberArray('D', letters)).toEqual([1, 2]);
    expect(stringToNumberArray('G', letters)).toEqual([2, 3]);
    expect(stringToNumberArray('H', letters)).toEqual([1, 2, 3]);
    expect(stringToNumberArray('P', letters)).toEqual([1, 2, 3, 4]);
    expect(stringToNumberArray('f', letters)).toEqual([1, 2, 3, 4, 5]);
    expect(stringToNumberArray('-', letters)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('Should convert single character', () => {
    expect(letterToNumbers('r', letters)).toEqual([1, 2, 4, 6]);
    expect(letterToNumbers('A', letters)).toEqual([]);
    expect(letterToNumbers('B', letters)).toEqual([1]);
    expect(letterToNumbers('D', letters)).toEqual([1, 2]);
    expect(letterToNumbers('G', letters)).toEqual([2, 3]);
    expect(letterToNumbers('H', letters)).toEqual([1, 2, 3]);
    expect(letterToNumbers('P', letters)).toEqual([1, 2, 3, 4]);
    expect(letterToNumbers('f', letters)).toEqual([1, 2, 3, 4, 5]);
    expect(letterToNumbers('-', letters)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('Should convert two characters at boundary', () => {
    expect(stringToNumberArray('AB')).toEqual([1]);
    expect(stringToNumberArray('AA')).toEqual([]);
    expect(stringToNumberArray('AG')).toEqual([2, 3]);
  });

  test('Should convert two characters', () => {
    expect(stringToNumberArray('BG', letters)).toEqual([2, 3, 7]);
    expect(stringToNumberArray('BA', letters)).toEqual([7]);
    expect(stringToNumberArray('CA', letters)).toEqual([8]);
    expect(stringToNumberArray('DA', letters)).toEqual([7, 8]);
    expect(stringToNumberArray('EA', letters)).toEqual([9]);
    expect(stringToNumberArray('FA', letters)).toEqual([7, 9]);
    expect(stringToNumberArray('FB', letters)).toEqual([1, 7, 9]);
    expect(stringToNumberArray('GA', letters)).toEqual([8, 9]);
    expect(stringToNumberArray('HA', letters)).toEqual([7, 8, 9]);
    expect(stringToNumberArray('IA', letters)).toEqual([10]);
    expect(stringToNumberArray('JA', letters)).toEqual([7, 10]);
    expect(stringToNumberArray('KA', letters)).toEqual([8, 10]);
    expect(stringToNumberArray('gA', letters)).toEqual([12]);
    expect(stringToNumberArray('CB', letters)).toEqual([1, 8]);
  });

  test('Should convert three characters', () => {
    expect(stringToNumberArray('AAAA', letters)).toEqual([]);
  });

  test('Should convert four characters', () => {
    expect(stringToNumberArray('ABBB', letters)).toEqual([1, 7, 13]);
  });
});

describe('buildNumberFromFlags', () => {
  test('Should return 0 for empty array', () => {
    expect(buildNumberFromFlags([])).toEqual(0);
  });

  test('Should return correct value for only a single selected number', () => {
    expect(buildNumberFromFlags([4])).toEqual(8);
  });

  test('Should return correct value with three items in array', () => {
    expect(buildNumberFromFlags([1, 3, 6])).toEqual(37);
  });

  test('Should return correct value with four items in array', () => {
    expect(buildNumberFromFlags([1, 2, 4, 6])).toEqual(43);
  });

  test('Should throw an exception if you try to encode >6 in array', () => {
    expect(() => buildNumberFromFlags([1, 3, 7])).toThrowError();
  });
});

describe('numberArrayToEncodedString', () => {
  test('Should create single letter', () => {
    expect(numberArrayToEncodedString([1, 2, 4, 6])).toEqual('r');
  });

  test('Test boundary value', () => {
    expect(numberArrayToEncodedString([7])).toEqual('BA');
  });

  test('Should create two-letter letter', () => {
    expect(numberArrayToEncodedString([2, 3, 7])).toEqual('BG');
    expect(numberArrayToEncodedString([2, 3, 8])).toEqual('CG');
    expect(numberArrayToEncodedString([7])).toEqual('BA');
    expect(numberArrayToEncodedString([8])).toEqual('CA');
    expect(numberArrayToEncodedString([9])).toEqual('EA');
    expect(numberArrayToEncodedString([10])).toEqual('IA');
    expect(numberArrayToEncodedString([11])).toEqual('QA');
    expect(numberArrayToEncodedString([13])).toEqual('BAA');
    expect(numberArrayToEncodedString([9, 1])).toEqual('EB');
  });

  test('Should create four-letter letter', () => {
    expect(numberArrayToEncodedString([19])).toEqual('BAAA');
    expect(numberArrayToEncodedString([13, 14, 20])).toEqual('CDAA');
    expect(numberArrayToEncodedString([20])).toEqual('CAAA');
    expect(numberArrayToEncodedString([21])).toEqual('EAAA');
    expect(numberArrayToEncodedString([22])).toEqual('IAAA');
    expect(numberArrayToEncodedString([2, 3, 8, 9, 10, 12, 13, 17, 18, 21])).toEqual('ExuG');
  });

  test('Should create three-letter letter', () => {
    expect(numberArrayToEncodedString([13, 14])).toEqual('DAA');
    expect(numberArrayToEncodedString([15])).toEqual('EAA');
    expect(numberArrayToEncodedString([16])).toEqual('IAA');
    expect(numberArrayToEncodedString([17])).toEqual('QAA');
    expect(numberArrayToEncodedString([18])).toEqual('gAA');
    expect(numberArrayToEncodedString([2, 3, 6, 9, 10, 12, 13, 17, 18, 21])).toEqual('Exsm');
  });

  test('Should create a large set of widely spaced numbers', () => {
    expect(numberArrayToEncodedString([13, 114, 172, 78, 984, 622, 621, 682, 691, 715, 591, 1072,
      1022, 1057, 231, 977, 562, 1031, 1341])).toEqual('EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAAAQCA' +
      'AAAAAgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAIAAAAAAAAAMAAAAEAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAIAAAAAAAAAgAAAAAgAAAAAAAAABAA');
  });

  test('Should allow a single high number', () => {
    expect(numberArrayToEncodedString([198])).toEqual('gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  });
});

describe('Two-way conversion', () => {
  it.each([
    [[13, 14], 'DAA'],
    [[13], 'BAA'],
    [[14], 'CAA'],
    [[15], 'EAA'],
    [[16], 'IAA'],
    [[17], 'QAA'],
    [[18], 'gAA'],
    [[19], 'BAAA'],
    [[1, 2, 3, 4, 5, 6], '-'],
  ])('Converts %p expecting %p', (numbers: number[], str: string) => {
    expect(numberArrayToEncodedString(numbers)).toEqual(str);
    expect(stringToNumberArray(str)).toEqual(numbers.sort());
  });
});

describe('numberToEncodingChar', () => {
  test('Should get single encoding letter for number', () => {
    expect(numberToEncodingChar(43)).toEqual('r');
    expect(numberToEncodingChar(38)).toEqual('m');
    expect(numberToEncodingChar(55)).toEqual('3');
    expect(numberToEncodingChar(6)).toEqual('G');
    expect(numberToEncodingChar(0)).toEqual('A');
    expect(numberToEncodingChar(63)).toEqual('-');
  });

  test('Should throw exception if out of range character encoded', () => {
    expect(() => numberToEncodingChar(64)).toThrowError();
  });
});

describe('buildSet', () => {
  test('Should return static array', () => {
    const expected = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    const output = buildSet();
    expect(output).toEqual(expected);
  });
});
