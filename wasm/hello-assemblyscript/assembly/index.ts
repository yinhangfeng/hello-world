// The entry file of your WebAssembly module.

class Struct1 {
  constructor(public aaa: i32, public bbb: string) {}
}

export function add(a: i32, b: i32): i32 {
  // console.log(`add ${a} + ${b}`);
  let arr: Struct1[] = [];
  for (let i: i32 = 0; i < 10000; ++i) {
    for (let j: i32 = 0; j < 10000; ++j) {
      arr.push(new Struct1(j, `bbb${j.toString()}`));
    }
    for (let j: i32 = 0; j < 10000; ++j) {
      arr.pop();
    }
  }

  return a + b + arr.length;
}

// console.log(`add ${add(1, 2)}`);
