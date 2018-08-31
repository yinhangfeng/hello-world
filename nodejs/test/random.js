'use strict';

function random(n) {
  return Math.floor(Math.random() * n);
}

function aaa(change) {
  const a = random(3);

  const b = random(3);

  let x = [];
  for (let i = 0; i < 3; ++i) {
    if (a !== i && b !== i) {
      x.push(i);
    }
  }

  const c = x[random(x.length)];

  if (change) {
    for (let i = 0; i < 3; ++i) {
      if (b !== i && c !== i) {
        return i === a;
      }
    }
  }

  return b === a;
}

let x = 0;
let count = 100000;
for (let i = 0; i < count; ++i) {
  if (aaa(true)) {
    ++x;
  }
}

console.log(x / count);