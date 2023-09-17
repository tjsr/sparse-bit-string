import { convertNumberToBase64, parseBase64Number } from "../src/conversion";

describe('parseBase64Number', () => {
  test('Should convert single-character value', () => {
    expect(parseBase64Number("A")).toEqual(0);
    expect(parseBase64Number("B")).toEqual(1);
    expect(parseBase64Number("-")).toEqual(63);
  });

  test('Should convert dual-character values', () => {
    expect(parseBase64Number("AA")).toEqual(0);
    expect(parseBase64Number("AB")).toEqual(1);
    expect(parseBase64Number("A-")).toEqual(63);
    expect(parseBase64Number("BA")).toEqual(64);
    expect(parseBase64Number("B-")).toEqual(127);
    expect(parseBase64Number("f7")).toEqual(2043);
  });

  test('Should convert many-character values', () => {
    expect(parseBase64Number("AAAAAA")).toEqual(0);
    expect(parseBase64Number("AAABA")).toEqual(64);
    expect(parseBase64Number("AACA")).toEqual(128);
    expect(parseBase64Number("AACAD")).toEqual(8195);
  })
});

describe('convertNumberToBase64', () => {
  test('Should convert basic numbers to encoded strings', () => {
    expect(convertNumberToBase64(0)).toEqual("");
    expect(convertNumberToBase64(64)).toEqual("BA");
    expect(convertNumberToBase64(128)).toEqual("CA");
    expect(convertNumberToBase64(8195)).toEqual("CAD");
    expect(convertNumberToBase64(512)).toEqual("IA");
    expect(convertNumberToBase64(880)).toEqual("Nw");
    expect(convertNumberToBase64(1035)).toEqual("QL");
    expect(convertNumberToBase64(1643)).toEqual("Zr");
  });
});
