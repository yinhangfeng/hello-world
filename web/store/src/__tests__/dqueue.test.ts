import {
  createDQueue,
  pushCurrent,
  moveCurrent,
  setCurrent,
  getCurrent,
  set,
  get,
  clear,
  size,
} from '../plugins/undoable/dqueue';

it('dqueue', () => {
  const queue = createDQueue(5);

  setCurrent(queue, 1);
  expect(size(queue)).toBe(1);
  pushCurrent(queue, 2);
  pushCurrent(queue, 3);
  expect(size(queue)).toBe(3);

  moveCurrent(queue, -1);
  moveCurrent(queue, -1);
  moveCurrent(queue, 1);

  expect(queue.queue.slice(0, 3)).toStrictEqual([1, 2, 3]);

  pushCurrent(queue, 4);
  pushCurrent(queue, 5);
  pushCurrent(queue, 6);

  expect(size(queue)).toBe(5);

  pushCurrent(queue, 7);

  expect(size(queue)).toBe(5);

  expect(getCurrent(queue)).toBe(7);
  set(queue, queue.current - 1, -6);
  expect(get(queue, queue.current - 1)).toBe(-6);

  expect(queue.queue).toStrictEqual([7, 2, 4, 5, -6]);

  expect(moveCurrent(queue, -5)).toBeFalsy();
  expect(moveCurrent(queue, 5)).toBeFalsy();

  expect(moveCurrent(queue, -4)).toBeTruthy();
  expect(moveCurrent(queue, 1)).toBeTruthy();

  pushCurrent(queue, 0);
  pushCurrent(queue, 0);
  pushCurrent(queue, 0);
  pushCurrent(queue, 0);

  expect(queue.queue).toStrictEqual([0, 0, 4, 0, 0]);

  clear(queue);
  expect(size(queue)).toBe(1);
  expect(getCurrent(queue)).toBe(undefined);
});
