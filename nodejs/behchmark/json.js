const jsonArrStr = '[1, 2, 3]';
const jsonObjStr = '{"0": 1}';

function test1() {
  return JSON.stringify(JSON.parse(jsonArrStr));
}

function test2() {
  return JSON.stringify(JSON.parse(jsonObjStr));
}

function benchmark(cbk) {
  const start = Date.now();
  for (let i = 0; i < 100000; ++i) {
    cbk();
  }
  console.log('time:', Date.now() - start);
}

benchmark(test1);
benchmark(test2);