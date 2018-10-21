const LOOP = 100000;

function xxx(obj, depth) {
  let res = obj;
  while (depth--) {
    res = Object.create(res);
    res[`depth${depth}`] = depth;
  }
  return res;
}

function func3() {
  const a1 = 1;
  function func1() {

    const b1 = 2;
  
    function func2() {
      const temp = new Array(LOOP);
      const a2 = 1;
      const o1 = {
        a1: 1,
      };

      Object.setPrototypeOf(o1, null);

      const o2 = xxx(o1, 10000);

      console.log(o2);
  
      for (let j = 0; j < 10; ++j) {
        console.time('a');
        for (let i = 0; i < LOOP; ++i) {
          temp[i] = a1;
        }
        console.timeEnd('a');

        console.time('b');
        for (let i = 0; i < LOOP; ++i) {
          temp[i] = o1.a1;
        }
        console.timeEnd('b');
  
        console.time('c');
        for (let i = 0; i < LOOP; ++i) {
          temp[i] = o2.a1;
        }
        console.timeEnd('c');
      }
    }
    func2();
  }
  
  func1();
}

func3();
