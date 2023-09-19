import { extractCompressedBitstring } from "../src/decoder";

describe('extractCompressedBitstring', () => {
  test('Should take a compressed string and extract a range', () => {
    const header = "BkFADAEAIAKAYAeA1A3A8BA"
    const body = "CAAAAAAIADAoMa";
    const payload = header + body;

    const expectedOutput = [2, 6, 7, 14, 15, 21, 23, 37, 38, 52, 100];
    const output = extractCompressedBitstring(payload);
    expect(output).toStrictEqual(expectedOutput);
  });
});
