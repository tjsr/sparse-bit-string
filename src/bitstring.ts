export type EncodedString = string;
export type EncodingSet = string[];

export const numberArrayToEncodedString = (input: number[]): EncodedString => {
  if (input === undefined) {
    console.debug('An undefined array was passed in but should not happen.');
    return '';
  }
  const letters: string[] = buildSet();
  let workingArray: number[] = [...input].sort();
  let outputString = '';
  while (workingArray.length > 0) {
    const tmpArray = workingArray.filter((n) => n <= 6);
    workingArray = workingArray.filter((n) => n > 6).map((n) => n - 6);

    const currentTmpNum = buildNumberFromFlags(tmpArray);
    const currentChar = numberToEncodingChar(currentTmpNum, letters);
    outputString = currentChar + outputString;
  }
  return outputString;
};

export const singleValueToNumber = (value: string, letters?: EncodingSet): number => {
  return (letters || buildSet()).findIndex((arrValue) => arrValue == value);
};

export const buildSet = (): EncodingSet => {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
};

export const letterToNumbers = (str: string, letters?: EncodingSet): number[] => {
  if (letters == undefined) {
    letters = buildSet();
  }

  const output: number[] = [];
  let value: number = letters.indexOf(str.charAt(str.length-1));
  for (let add = 1;add <= 6;add++) {
    if (value & 1) {
      output.push(add);
    }
    value = value >> 1;
  }
  return output;
};

export const stringToNumberArray = (str: EncodedString, letters?: EncodingSet): number[] => {
  if (letters == undefined) {
    letters = buildSet();
  }

  const output: number[] = [];
  const inputArray = str.split('');

  let offset = 1;
  for (let idx = inputArray.length-1;idx >= 0;idx--) {
    const v = inputArray[idx];
    let parts: number[] = letterToNumbers(v, letters);
    parts = parts.map((n) => n + offset - 1);

    parts.forEach((n) => {
      output.push(n);
    });
    offset += 6;
  }

  return output;
};

export const buildNumberFromFlags = (input: number[]): number => {
  if (input.length == 0) {
    return 0;
  }
  input.forEach((n) => {
    if (n > 6) {
      throw new Error('Input numbers must be <64');
    }
  });
  return input.reduce((p, n) => {
    return p | ((1 << n) >> 1);
  }, 0);
};

export const numberToEncodingChar = (input: number, letters?: EncodingSet): string => {
  if (letters === undefined) {
    letters = buildSet();
  }
  if (input > 63) {
    throw Error('Can not encode character >63');
  }
  return letters[input];
};
