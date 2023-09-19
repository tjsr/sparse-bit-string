export type { EncodedString, CompressedBitArrayWithHeader } from './types';
export { numberArrayToEncodedString } from './encoder';
export { extractCompressedBitstring, stringToNumberArray } from './decoder';
export { generatedCompressedStringWithHeader } from './compactor';
export { buildSet } from './common';