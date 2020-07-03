const _ = require('lodash');

function testIsEqualWith() {
  const customizer = (v1, v2, key) => {
    console.log(v1, v2, key)
    if (key === 'id') {
      return true;
    }
  };
  const res = _.isEqualWith(
    {
      type: 'brand',
      logic: 'in',
      id: '7c20f245-3b5f-41f2-a6ea-00866f2a9e8a',
      value: [{ id0: '111', name0: 'abc', id: '98168', name: 'xxx' }],
    },
    {
      id: '',
      type: 'brand',
      logic: 'in',
      value: [{ id0: '111', name0: 'abc', id: '98168', name: 'xxx' }],
    },
    customizer
  );
  console.log('testIsEqualWith', res);
}

function testMerge() {
  const a = {
    a: { a: 1},
  };

  const b = {
    a: { b: 2 },
    c: 1,
  };

  console.log(_.merge({}, a, b), a);
}

testMerge();

// testIsEqualWith();
