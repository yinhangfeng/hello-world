export function generateTestLineData1(n: number = 1000) {
  return Array.from({ length: n }, (e, i) => {
    return {
      x: i,
      y: Math.random() * 100,
    };
  });
}
