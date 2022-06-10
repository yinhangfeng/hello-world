export interface DQueue {
  queue: any[];
  tail: number;
  current: number;
  head: number;
  limit: number;
}

function circleDiff(queue: DQueue, index1: number, index2: number) {
  const d = index1 - index2;
  if (d < 0) {
    return d + queue.limit;
  }
  return d;
}

function circleIndex(queue: DQueue, index: number) {
  const limit = queue.limit;
  if (index >= limit) {
    return index - limit;
  }
  if (index < 0) {
    return index + limit;
  }
  return index;
}

export function createDQueue(limit: number): DQueue {
  if (limit < 1) {
    limit = 1;
  }
  return {
    queue: new Array(Math.min(8, limit)),
    tail: 0,
    current: 0,
    head: 0,
    limit,
  };
}

export function pushCurrent(queue: DQueue, data: any) {
  const queueArr = queue.queue;
  const newCurrent = circleIndex(queue, queue.current + 1);
  if (queue.current !== queue.head) {
    for (let i = newCurrent; i !== queue.head; i = circleIndex(queue, i + 1)) {
      queueArr[i] = undefined;
    }
  }
  queue.current = newCurrent;
  queueArr[newCurrent] = data;
  queue.head = queue.current;

  if (queue.tail === newCurrent) {
    queue.tail = circleIndex(queue, queue.tail + 1);
  }
}

export function moveCurrent(queue: DQueue, n: number) {
  if (n === 0) {
    return false;
  }
  if (n > 0) {
    const d = circleDiff(queue, queue.head, queue.current);
    if (n > d) {
      return false;
    }
    queue.current = circleIndex(queue, queue.current + n);
  } else {
    const d = circleDiff(queue, queue.current, queue.tail);
    if (-n > d) {
      return false;
    }
    queue.current = circleIndex(queue, queue.current + n);
  }

  return true;
}

export function setCurrent(queue: DQueue, data: any) {
  queue.queue[queue.current] = data;
}

export function getCurrent(queue: DQueue) {
  return queue.queue[queue.current];
}

export function get(queue: DQueue, index: number) {
  return queue.queue[circleIndex(queue, index)];
}

export function set(queue: DQueue, index: number, data: any) {
  queue.queue[circleIndex(queue, index)] = data;
}

export function clear(queue: DQueue) {
  queue.queue.fill(undefined);
  queue.head = queue.tail = queue.current = 0;
}

export function size(queue: DQueue) {
  return circleDiff(queue, queue.head, queue.tail) + 1;
}
