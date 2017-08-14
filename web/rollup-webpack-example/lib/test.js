// /test.js

import {
  name
} from '../package.json';

global.__DEV__ = true;

function test_1(...a) {
  console.log(a);
  const x = Array.from(a);
  console.log(x);

  for (let a1 of a) {
    console.log(a1);
  }
}

function test_2(a = 1, b = {}) {
  console.log(a, b);
}

const xxx = function () {

}

export default function test(a, ...b) {
  console.log('test:', a, name, b);
  test_1(1, 2, 3);
  test_2(2, {
    x: 2
  });
  return a;
}