const { produce } = require('immer');

function test1() {
  const state1 = {
    a: 1,
    b: {
      b1: 1,
    },
    c: {
      c1: 1,
    },
  };

  console.log('state1:', state1);

  const state2 = produce(state1, (draft) => {
    draft.a = 2;
    draft.b.b1 = 2;
  });

  console.log('state2:', state2);

  console.log('state.c === state2.c: ', state1.c === state2.c);

  const c1 = state1.c;
  const c2 = state2.c;

  console.log('c1 === c2', c1 === c2);

  c1.aaa = 1;
  console.log(c1, c2);

  state1.xxx = 3;
  state1.b.xxx = 3;
  state1.c.xxx = 3;

  // Object.defineProperty(state2, 'xxx', {
  //   value: 3,
  // });
  // Object.defineProperty(state2.c, 'xxx', {
  //   value: 4,
  // });

  console.log('state1:', state1);
  console.log('state2:', state2);

  const state3 = produce(state2, (draft) => {
    draft.b.b1 = 2;
  });

  console.log('state3:', state3);

  console.log('state2.c === state3.c:', state2.c === state3.c);
}

function test2() {
  const state0 = {
    a: 1,
    b: {
      b1: 1,
    },
    c: {
      c1: 1,
    },
    d: () => {},
  };

  const state1 = produce(state0, (draft) => {
    console.log('produce(state0)', draft === state0);
  });

  console.log('state1:', state1, 'state1 === state0:', state1 === state0);

  const state2 = produce(state1, (draft) => {
    draft.a = 2;
    draft.b.b1 = 2;
    // return {
    //   xxx: 1,
    // };
  });

  console.log('state2:', state2, 'state2 === state1:', state2 === state1);

  const state3 = produce(state2, (draft) => {
    console.log('produce(state2)', draft === state2);
    draft.a = 2;
    draft.b.b1 = 2;
    console.log('produce(state2)', draft === state2);
    // return {
    //   xxx: 1,
    // };
  });

  console.log('state3:', state3, 'state3 === state2:', state3 === state2);
}

test2();
