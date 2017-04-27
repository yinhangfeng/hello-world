/*
 * This is the main entry point for your package.
 *
 * You can import other modules here, including external packages. When
 * bundling using rollup you can mark those modules as external and have them
 * excluded or, if they have a jsnext:main entry in their package.json (like
 * this package does), let rollup bundle them into your dist file.
 */

import { add } from './utils.js';
// import { add } from 'rollup-webpack-example/utils.js'; // rollup webpack 都不能引用当前工程名字
import test from './test';
import Test3 from './Test3';
import Test4 from './Test4';
import aaa from './circle-ref/a';
import ccc from './circle-ref/c';
import lazy from './lazy';
import importX from './import/x'
// const a111 = require('111'); // rollup 不会处理 webpack 报错找不到module
import maaa from 'memory-aaa';
// import mJson from 'memory-json.json';

/**
 * Multiply two numbers together, returning the product.
 * This function illustrates an export from an entry point that uses imports
 * from other files. It also illustrates tail-call optimizations in ES6,
 * otherwise the `negative` parameter wouldn't be here.
 */
export default function multiply(n, m, negative=false) {
  test();
  new Test3().test3();
  new Test4().test4();
  aaa.a();
  ccc.c();
  lazy.init();
  const lazyA = lazy.a();
  importX();
  a111();
  maaa();
  // console.log(mJson);
  if (n === 0 || m === 0) {
    return 0;
  } else if (n === 1) {
    return m;
  } else if (m === 1) {
    return n;
  } else if (n < 0 && m < 0) {
    return multiply(-n, -m);
  } else if (n < 0) {
    return multiply(-n, m, !negative);
  } else if (m < 0) {
    return multiply(n, -m, !negative);
  }

  let result = n;
  while (--m) {
    result = add(result, n);
  }
  return negative ? -result : result;
}
zhi