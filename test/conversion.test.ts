import { parseBase64Number } from "../src/conversion";

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
  });

  test('Should convert many-character values', () => {
    expect(parseBase64Number("AAAAAA")).toEqual(0);
    expect(parseBase64Number("AAABA")).toEqual(64);
    expect(parseBase64Number("AACA")).toEqual(128);
    expect(parseBase64Number("AACAD")).toEqual(8195);
  })
});