import { extractCompressedBitstring } from "../src/decoder";
import { generateCompressedStringWithHeader } from "../src/compactor";

describe('extractCompressedBitstring', () => {
  test('Should take a compressed string and extract a range', () => {
    const header = "BkFADAEAIAKAYAeA1A3A8BA"
    const body = "CAAAAAAIADAoMa";
    const payload = header + body;

    const expectedOutput = [2, 6, 7, 14, 15, 21, 23, 37, 38, 52, 100];
    const output = extractCompressedBitstring(payload);
    expect(output).toStrictEqual(expectedOutput);
  });

  test('Should extract a short string', () => {
    const expectedOutput = [1, 5, 9, 14];
    const generatedString = generateCompressedStringWithHeader(expectedOutput);
    expect(generatedString).toEqual("AOACER");
    const output = extractCompressedBitstring("AOACER");
    expect(output).toStrictEqual(expectedOutput);

    const expectedOutput2 = [2, 4, 7, 13];
    const generatedString2 = generateCompressedStringWithHeader(expectedOutput2);
    expect(generatedString2).toEqual("ANABBK");
    const output2 = extractCompressedBitstring("ANABBK");
    expect(output2).toStrictEqual(expectedOutput2);
  });

  test('Should extract a long string', () => {
    const availableIds = [813,814,815,817,819,820,821,822,897,898,899,900];
    const availableString = "OECABMsM3OAD-X"
    expect(extractCompressedBitstring(availableString)).toStrictEqual(availableIds);
    const wantedIds = [77,102,108,242,437,664,666,727,778,786,826,854,1026,1274,1275,1276,1277,1278,1279,1280,1308,1311,1312,1324,1326,1336,1337,1338,1339];
    const wantedString = "U7GABBMBtDxG2KXKbLWMTM5NXQBPAFABkAAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAMBAAAAAAAANgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGCAAAB";
    expect(extractCompressedBitstring(wantedString)).toStrictEqual(wantedIds);
  });
});
