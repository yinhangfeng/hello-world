'use strict';
// lazy/index.js

const xxx = require('./xxx');

// xxx
xxx.isInited = true;

module.exports = {
  get a() {
    return require('./a');
  },

  init() {
    xxx.isInited = true;
  }
}