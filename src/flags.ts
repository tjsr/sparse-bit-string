import { FlagSet } from "./types";

export const buildNumberFromFlags = (input: FlagSet): number => {
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
