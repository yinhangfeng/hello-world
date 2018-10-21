const temp = new Array(100000);

temp.fill(0);
console.time('bbb');
for (let i = 0; i < 1000000; ++i) {
  temp[i] = [1, 2, 3, 4, i];
}
console.timeEnd('bbb');