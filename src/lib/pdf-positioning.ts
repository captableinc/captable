export type PageMeasurement = { height: number; width: number }[];

export type Range = [number, number];

export function getPageNumber(y: number, ranges: Range[]) {
  let left = 0;
  let right = ranges.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const range = ranges?.[mid];

    if (!range) {
      throw new Error("range not found");
    }

    const [start, end] = range;

    const floorStart = Math.floor(start);
    const floorEnd = Math.floor(end);

    if (y >= floorStart && y <= floorEnd) {
      return mid;
    } else if (y < floorStart) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}

export function generateRange(
  measurements: PageMeasurement,
  viewportWidth: number,
) {
  let startingRange = 0;
  return measurements.map(({ width, height }) => {
    const ratio = viewportWidth / width;
    const calculatedHeight = ratio * height;
    const range = [startingRange, startingRange + calculatedHeight] as Range;
    startingRange += calculatedHeight;
    return range;
  });
}
