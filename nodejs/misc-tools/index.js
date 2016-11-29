'use strict';

const fs = require('fs');

/**
 * 获取react-native 打包bundle 中最大的几个引用
 */
function analysisRnBundle1() {
  let str = fs.readFileSync('/Users/yinhf/Downloads/xxxxx.bundle', {
    encoding: 'UTF8',
  });
  let arr = str.split('\n__d(')
    .sort((a, b) => b.length - a.length)
    .slice(0, 30)
    .map((a) => a.slice(0, a.indexOf('*/,')));

    console.log(arr);
}

analysisRnBundle1();
