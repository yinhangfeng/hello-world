// const fs = require('fs');
const test3 = require('./test3');
const test4Type = Math.random() > 0.5 ? 'a' : 'b';
const test4 = require('./test4/' + test4Type);

// test2
module.exports.test2 = function test2() {
  test3();
  test4();
  fs.readFile();
}