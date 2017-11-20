'use strict';

class Test {
  static a = 1;
  b = 2;

  constructor({
    x,
    y,
    ...z
  }) {
    this.c = 3;
    const {
      a = 1,
      ...b
    } = x;
    this.yyy = {
      x,
      ...b,
    };
  }

  async aaa(a,) {
    const ccc = await this.ccc(a);
    throw ccc;
  }
  
  bbb = (b,) => {
    console.log('bbb', this.a, this.b, this.c, this.yyy);
  };

  async ccc(c) {
    return 'ccc' + c;
  }
}

const test = new Test({
  x: 1,
  y: 2,
  aaa: 1,
  bbb: 2,
});

console.log(test.bbb());

test.aaa(111).then((res) => {
  console.log(res);
}, (err) => {
  console.log('err:', err);
});

module.exports = Test;