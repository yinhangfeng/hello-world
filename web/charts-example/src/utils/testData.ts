export function generateTestLineData1(
  n: number = 100,
  { offset = 0, amplitude = 100, x = 'x', y = 'y' } = {},
) {
  return Array.from({ length: n }, (e, i) => {
    i += offset;
    return {
      [x]: i,
      [y]: Math.random() * amplitude,
      z: Math.random() * amplitude * i,
      a: i,
    };
  });
}
