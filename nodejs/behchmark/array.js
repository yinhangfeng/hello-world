function test1(array) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (i % 5 === 0) {
      array.splice(i, 1);
    }
  }
  return array;
}

function filter(v, i) {
  return i % 5 !== 0;
}

function test2(array) {
  return array.filter(filter);
}

function benchmark(cbk) {
  const array = [];
  for (let i = 0; i < 100; ++i) {
    array.push(i);
  }
  const start = Date.now();
  let result = array;
  for (let i = 0; i < 100000; ++i) {
    result = cbk(array.slice());
  }
  console.log(cbk.name, 'time:', Date.now() - start);
  console.log('result:', result.length);
  return result;
}

for (let i = 0; i < 3; ++i) {
  benchmark(test1);
  benchmark(test2);
  // benchmark(test3);
  // benchmark(test4);
  console.log();
}
