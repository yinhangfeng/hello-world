function test1(x: number, { aaa, bbb, ccc }: { aaa: number; bbb: boolean; ccc: string }) {
  return aaa;
}

test1(1, {
  aaa: 1,
  bbb: true,
  ccc: 'ccc',
});
