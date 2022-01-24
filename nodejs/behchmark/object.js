const obj = {
  aaa: 1,
  bbb: '2',
};

// Object.setPrototypeOf(obj, null);

// let key = Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];
let key = '' + Math.random();

function test1() {
  return key in obj;
}

function test2() {
  return obj[key] !== undefined;
}

function test3() {
  if (key in obj) {
    return obj[key];
  }
}

function test4() {
  const value = obj[key];
  if (value !== undefined) {
    return value;
  }
}

function benchmark(cbk) {
  const start = Date.now();
  let result;
  for (let i = 0; i < 10000000; ++i) {
    result = cbk();
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
}
