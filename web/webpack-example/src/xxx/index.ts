// import test1 from './test1';
// import { test2 } from './test2';
// import test5 from './test5';
// // import 了 test6 但没有使用 会被 babel-loader 优化掉
// // 如果改为 import './test6' 则会保留
// import test6 from './test6';
// import test7 from './test7.json';
// import test8 from './test8';
// import test9 from './test9';
// import test10 from './test10';
// import root from './root';
// import isNull from 'lodash/isNull';
// import styles from './index.module.less';
// import isNode from './detect-node';

// import './ignore-test';
import ignoreTest from 'unload/dist/es/index.js';
console.log(ignoreTest)

// webpack 简单依赖测试
function test() {
  test1(styles.aaa);
}
test1();
test2();
test5();
isNull();

const aaa = 1;
const b = {
  aaa,
  bbb: 2,
  test7,
  test8,
  test9,
  root,
  test10,
};
