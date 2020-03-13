'use strict';

// import './bootstrap';

function* helloWorldGenerator(arg1) {
  const ret1 = yield arg1 + 'hello';
  const ret2 = yield ret1 + 'world';
  return ret2 + 'ending';
}

const hw = helloWorldGenerator(0);

console.log(hw.next(1));
console.log(hw.next(2));
console.log(hw.next(3));