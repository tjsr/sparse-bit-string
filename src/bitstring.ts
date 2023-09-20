export type { EncodedString, CompressedBitArrayWithHeader } from './types';

import { extractCompressedBitstring, stringToNumberArray } from './decoder';

import { buildSet } from './common';
import { generateCompressedStringWithHeader } from './compactor';
import { numberArrayToEncodedString } from './encoder';

export {numberArrayToEncodedString, extractCompressedBitstring, stringToNumberArray, generateCompressedStringWithHeader, buildSet};