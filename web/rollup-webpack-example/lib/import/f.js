'use strict';

// import/f.js
// 混用import 和require 会使rollup-plugin-commonjs认为本文件不是commonjs 而不处理require
import a from './a';
const b = require('./b');

export default function fff() {

}