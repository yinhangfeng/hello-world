let map = new Map();
let obj = {};

function test1(i) {
  const key = `k_${i}`;
  // map.set(key, key);
  return map.get(key);
}

function test2(i) {
  const key = `k_${i}`;
  // obj[key] = key;
  return obj[key];
}

function test3(i) {
  const key = `k_${i}`;
  return map.has(key);
}

function test4(i) {
  const key = `k_${i}`;
  return key in obj;
}

function benchmark(cbk) {
  const start = Date.now();
  let result;
  for (let i = 0; i < 1000000; ++i) {
    result = cbk(i);
  }
  console.log(cbk.name, 'time:', Date.now() - start);
  return result;
}

for (let i = 0; i < 3; ++i) {
  benchmark(test1);
  benchmark(test2);
  benchmark(test3);
  benchmark(test4);
  console.log();

  map = new Map();
  obj = {};
}
