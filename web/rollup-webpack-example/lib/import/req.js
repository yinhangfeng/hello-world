// import/req.js

const a = require('./a');
const a1 = require('./a1');
// const b = require('./b');
const c = require('./c');
const d = require('./d');

module.exports = function() {
  a();
  a1();
  c();
  d();
};