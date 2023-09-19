import { EncodingSet } from "./types";

export const buildSet = (): EncodingSet => {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
};

