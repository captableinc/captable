export type PageMeasurement = { height: number; width: number }[];

export function getPageNumber(y: number, ranges: [number, number][]) {
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (range && y >= Math.floor(range[0]) && y <= Math.floor(range[1])) {
      return i;
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
    const range = [startingRange, startingRange + calculatedHeight] as [
      number,
      number,
    ];
    startingRange += calculatedHeight;
    return range;
  });
}
