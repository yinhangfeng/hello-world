// 'use strict';

const object1 = {
  property1: 42
};

const object2 = Object.freeze(object1);

object2.property1 = 33;

console.log(object2.property1);