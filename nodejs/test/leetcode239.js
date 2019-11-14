/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  const length = nums.length;
  const ret = new Array(length - k + 1);
  const dqueue = new Dqueue(k);
  let num;

  let i = 0;
  for (; i < k; ++i) {
    num = nums[i];
    while (nums[dqueue.getLast()] <= num) {
      dqueue.removeLast();
    }
    dqueue.addLast(i);
  }
  ret[0] = nums[dqueue.getFirst()];

  for (; i < length; ++i) {
    if (dqueue.getFirst() < i - k + 1) {
      dqueue.removeFirst();
    }
    num = nums[i];
    while (nums[dqueue.getLast()] <= num) {
      dqueue.removeLast();
    }
    dqueue.addLast(i);
    ret[i - k + 1] = nums[dqueue.getFirst()];
  }

  return ret;
};

class Dqueue {
  constructor(size) {
    this.dqueue = new Array(size);
    this.size = size;
    this.head = 0;
    this.tail = 0;
  }

  getFirst() {
    return this.dqueue[this.head];
  }

  getLast() {
    if (this.tail === this.head) {
      return null;
    }
    return this.dqueue[this.tail === 0 ? this.size - 1 : this.tail - 1];
  }

  addLast(e) {
    this.dqueue[this.tail] = e;
    if (++this.tail === this.size) {
      this.tail = 0;
    }
  }

  removeFirst() {
    // if (this.head === this.tail) {
    //   return;
    // }
    if (++this.head === this.size) {
      this.head = 0;
    }
  }

  removeLast() {
    if (--this.tail === -1) {
      this.tail = this.size - 1;
    }
  }
}

console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));