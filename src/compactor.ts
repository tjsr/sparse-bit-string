export const compactRange = (inputNumbers:number[], removeLower: number, removeUpper: number): number[] => {
  if (removeLower >= removeUpper) {
    throw new Error('Lower must be less than upper');
  }
  const removeRange = removeUpper - removeLower+1;
  const output: number[] = [...inputNumbers];
  for (let i = 0;i < output.length;i++) {
    if (output[i] >= removeLower && output[i] <= removeUpper) {
      throw new Error(`Can't compact when values exist inside given range`);  
    }
    if (output[i] > removeLower) {
      output[i] = output[i] - removeRange;
    }
  }
  return output;
}

export const removeRanges = (inputNumbers:number[], ranges: [number, number][]): number[] => {
  if (ranges.length > 1) {
    for (let i = 1;i < ranges.length;i++) {
      if (ranges[i-1][0] >= ranges[i][0]) {
        throw new Error("Removal ranges must be provided in order");
      }
      if (ranges[i-1][1] >= ranges[i][1]) {
        throw new Error("Removal ranges must be provided in order");
      }
    }
  }

  let outputNumbers = [...inputNumbers];
  for (let i = ranges.length-1;i >= 0;i--) {
    outputNumbers = compactRange(outputNumbers, ranges[i][0], ranges[i][1]);
  }

  return outputNumbers;
}