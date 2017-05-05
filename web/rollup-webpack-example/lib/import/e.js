'use strict';

// import/e.js

// 文件中包含__esModule 字符串或者 exports module的一些特殊用法(不在顶层导出) 可能使rollup-plugin-commonjs 使用createCommonjsModule
// Object.defineProperty(exports,"__esModule",{value:true});

// 不允许使用exports.default
exports.default = function () {
  console.log('eee');
};