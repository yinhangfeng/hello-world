'use strict';

import xxx from './xxx';

if (!xxx.isInited) {
  throw new Error('xxx');
}

export default function(a) {
  console.log(a);
  return a;
}