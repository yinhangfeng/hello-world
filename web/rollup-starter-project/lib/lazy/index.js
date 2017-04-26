'use strict';

const xxx = require('./xxx');

module.exports = {
  get a() {
    return require('./a');
  },

  init() {
    xxx.isInited = true;
  }
}