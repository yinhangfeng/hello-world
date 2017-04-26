'use strict';

// const a = require('./a');

import a from './a';

console.log('bbb', a);

export default {
  b() {
    console.log(a);
  }
};