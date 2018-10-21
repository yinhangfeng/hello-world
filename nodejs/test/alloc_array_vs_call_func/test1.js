function func1(a, b, c, d, e) {
  return e;
}
function func2(a, b, c, d, e) {
  return arguments;
}
function func3(a, b, c, d, e) {
  const args = arguments;
  return e;
}
function func4(a, b, c, d, e) {
  return arguments[4];
}
function func4(...args) {
  return args;
}
const temp = new Array(100000);

temp.fill(0);

console.time('aaa');
for (let i = 0; i < 1000000; ++i) {
  temp[i] = func4(1, 2, 3, 4, i);
}
console.timeEnd('aaa');

