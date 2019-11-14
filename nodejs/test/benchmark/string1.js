const arr = [];
const length = 1000;

for (let i = 0; i < length; ++i) {
  arr.push(String((Math.random() * 10) << 0));
}

const str = arr.join('');

let x = '';

let start;
const loop = 100000;

start = Date.now();
for (let i = 0; i < loop; ++i) {
  for (let j = 0; j < length; ++j) {
    x = arr[j];
  }
}
console.log(Date.now() - start);

start = Date.now();
for (let i = 0; i < loop; ++i) {
  for (let j = 0; j < length; ++j) {
    x = str[j];
  }
}
console.log(Date.now() - start);

start = Date.now();
for (let i = 0; i < loop; ++i) {
  for (let j = 0; j < length; ++j) {
    x = arr[j];
  }
}
console.log(Date.now() - start);

start = Date.now();
for (let i = 0; i < loop; ++i) {
  for (let j = 0; j < length; ++j) {
    x = str[j];
  }
}
console.log(Date.now() - start);