import { Store, UndoableActionCreators, UndoablePlugin } from '..';
import ImmerPlugin from '../plugins/immer';
import CountModel from '../testing/models/count';
import Count1Model from '../testing/models/count1';
import Test1Model from '../testing/models/test1';
import TestPlugin from '../testing/plugins/TestPlugin';

it('count model', async () => {
  const store = new Store({
    name: 'my store',
    models: [new CountModel()],
  });

  const countModel = store.getModel<CountModel>('count')!;

  countModel.dispatch.increment();
  expect(countModel.state.count).toBe(1);

  countModel.dispatch.decrement();
  expect(countModel.state.count).toBe(0);

  const asyncIncrementRes1 = await countModel.dispatch.asyncIncrement();
  expect(asyncIncrementRes1.count).toBe(1);
  expect(countModel.state.count).toBe(1);

  const asyncSetStateRes1 = await countModel.dispatch.asyncSetState(3);
  expect(asyncSetStateRes1.count).toBe(4);
  expect(countModel.state.count).toBe(4);

  expect(store.getState().count.count).toBe(4);

  await countModel.dispatch.asyncSetState1(3);
  expect(countModel.state.count).toBe(7);

  store.destroy();
});

it('count model immer', async () => {
  const store = new Store({
    models: [new CountModel()],
    plugins: [new ImmerPlugin()],
  });

  const countModel = store.getModel<CountModel>('count')!;

  countModel.dispatch.increment();
  expect(countModel.state.count).toBe(1);

  const decrementRes = countModel.dispatch.decrement();
  expect(countModel.state.count).toBe(0);
  expect(decrementRes.count).toBe(0);

  const asyncIncrementRes1 = await countModel.dispatch.asyncIncrement();
  expect(asyncIncrementRes1.count).toBe(1);
  expect(countModel.state.count).toBe(1);

  const asyncSetStateRes1 = await countModel.dispatch.asyncSetState(3);
  expect(asyncSetStateRes1.count).toBe(4);
  expect(countModel.state.count).toBe(4);

  expect(store.getState().count.count).toBe(4);

  await countModel.dispatch.asyncSetState1(3);
  expect(countModel.state.count).toBe(7);

  store.destroy();
});

it('count model undoable', async () => {
  const store = new Store({
    models: [new CountModel()],
    plugins: [new UndoablePlugin()],
  });

  const countModel = store.getModel<CountModel>('count')!;

  countModel.dispatch.increment();
  expect(countModel.state.count).toBe(1);

  countModel.dispatch.decrement();
  expect(countModel.state.count).toBe(0);

  const asyncIncrementRes1 = await countModel.dispatch.asyncIncrement();
  expect(asyncIncrementRes1.count).toBe(1);
  expect(countModel.state.count).toBe(1);

  const asyncSetStateRes1 = await countModel.dispatch.asyncSetState(3);
  expect(asyncSetStateRes1.count).toBe(4);
  expect(countModel.state.count).toBe(4);

  expect(store.getState().count.count).toBe(4);

  countModel.dispatch.increment();
  countModel.dispatch.increment();
  countModel.dispatch.increment();
  countModel.dispatch.increment();
  countModel.dispatch.decrement();

  store.dispatch(UndoableActionCreators.undo());

  expect(countModel.state.count).toBe(8);

  store.dispatch(UndoableActionCreators.undo());
  expect(countModel.state.count).toBe(7);

  store.dispatch(UndoableActionCreators.redo());

  expect(countModel.state.count).toBe(8);

  store.dispatch(UndoableActionCreators.jump(0, countModel.name));
  expect(countModel.state.count).toBe(8);

  store.dispatch(UndoableActionCreators.jump(-3, countModel.name));
  expect(countModel.state.count).toBe(5);

  store.dispatch(UndoableActionCreators.jump(2, countModel.name));
  expect(countModel.state.count).toBe(7);

  store.dispatch(UndoableActionCreators.clearHistory(countModel.name));
  expect(countModel.state.count).toBe(7);

  store.destroy();
});

it('count1 model', async () => {
  const store = new Store({
    name: 'my store',
    models: [new Count1Model()],
    plugins: [new UndoablePlugin()],
  });

  const countModel = store.getModel<Count1Model>('count1')!;

  countModel.dispatch.increment();
  expect(countModel.state.count).toBe(1);

  countModel.dispatch.decrement();
  expect(countModel.state.count).toBe(0);

  const asyncIncrementRes1 = await countModel.dispatch.asyncIncrement();
  expect(asyncIncrementRes1.count).toBe(1);
  expect(countModel.state.count).toBe(1);

  const asyncSetStateRes1 = await countModel.dispatch.asyncSetState(3, 1, 2, 3);
  expect(asyncSetStateRes1.count).toBe(4);
  expect(countModel.state.count).toBe(4);

  expect(store.getState().count1.count).toBe(4);

  await countModel.dispatch.asyncSetState1(3);
  expect(countModel.state.count).toBe(7);

  countModel.dispatch.reset();
  expect(countModel.state.count).toBe(0);

  countModel.dispatch.increment();

  await countModel.dispatch(`${countModel.name}/ASYNC_RESET`);
  expect(countModel.state.count).toBe(0);

  store.destroy();
});

it('complex', async () => {
  const store = new Store({
    name: 'my store',
    models: [new CountModel()],
    plugins: [new ImmerPlugin(), new TestPlugin(), new UndoablePlugin()],
  });

  store.addModel(new Test1Model());
  store.addModels([new Count1Model()]);

  const countModel = store.getModel<CountModel>('count')!;
  const test1Model = store.getModel<Test1Model>('test1')!;

  const sub1 = countModel.subscribe(() => {
    console.log('countModel update');
  });

  const sub2 = test1Model.subscribe(() => {
    console.log('test1Model update1');
    sub3();
  });

  const sub3 = test1Model.subscribe(() => {
    console.log('test1Model update2');
  });

  test1Model.dispatch.increment();

  expect(test1Model.state.count).toBe(1);

  const decrementRes = test1Model.dispatch.decrement();
  expect(test1Model.state.count).toBe(0);
  expect(decrementRes.count).toBe(0);

  const asyncIncrementRes1 = await test1Model.dispatch.asyncIncrement();
  expect(asyncIncrementRes1.count).toBe(1);
  expect(test1Model.state.count).toBe(1);

  const asyncSetStateRes1 = await test1Model.dispatch.asyncSetState(3);
  expect(asyncSetStateRes1.count).toBe(4);
  expect(test1Model.state.count).toBe(4);

  expect(store.getState().test1.count).toBe(4);

  const computedSnapshot = test1Model.computed;
  const combinedStateSnapshot = test1Model.combinedState;

  expect(computedSnapshot.count1).toBe(5);
  expect(computedSnapshot.count2).toBe(9);
  // console.log('count3 getter call');
  expect(combinedStateSnapshot.count3).toBe(9);

  await test1Model.dispatch.asyncSetState1(3);
  expect(test1Model.state.count).toBe(7);

  expect(test1Model.computed.count1).toBe(8);
  expect(test1Model.computed.count2).toBe(15);
  // console.log('count3 getter call');
  expect(test1Model.computed.count3).toBe(15);

  test1Model.dispatch.increment();
  test1Model.dispatch.decrement();

  // console.log('count3 getter call');
  expect(test1Model.combinedState.count3).toBe(15);
  expect(store.getModelState<Test1Model>('test1')!.count3).toBe(15);

  expect(computedSnapshot.count1).toBe(5);
  expect(computedSnapshot.count2).toBe(9);
  // console.log('count3 getter call');
  expect(combinedStateSnapshot.count3).toBe(9);

  // console.log('count3 getter call');
  expect(test1Model.computed.count3).toBe(15);

  console.log(
    JSON.stringify(test1Model.computed),
    JSON.stringify(test1Model.combinedState)
  );

  store.destroy();
});
