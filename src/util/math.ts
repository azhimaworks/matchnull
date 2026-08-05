type SingleValue = number[];
type MultiValue = number[][];

export function getAverage(values: SingleValue): number;
export function getAverage(values: MultiValue): number[];
export function getAverage(
  values: SingleValue | MultiValue,
): number | number[] | null {
  if (!values || values.length === 0) {
    return null;
  }

  const isMultiDimension = Array.isArray(values[0]);

  if (isMultiDimension) {
    const multiValues = values as MultiValue;
    const numItems = multiValues.length;
    const dimensions = multiValues[0]!.length;

    const sums: number[] = [];
    for (let i = 0; i < dimensions; i++) {
      sums.push(0);
    }

    for (let i = 0; i < numItems; i++) {
      for (let d = 0; d < dimensions; d++) {
        sums[d]! += multiValues[i]![d]!;
      }
    }

    return sums.map((sum) => sum / numItems);
  } else {
    const singleValues = values as SingleValue;
    const sum = singleValues.reduce((acc, curr) => acc + curr, 0);
    return sum / singleValues.length;
  }
}
