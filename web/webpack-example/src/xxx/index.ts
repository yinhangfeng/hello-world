import test1 from './test1';
import { test2 } from './test2';
import test5 from './test5';
import isNull from 'lodash/isNull';
import styles from './index.module.less';

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
};
