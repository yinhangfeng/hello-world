const fs = require('fs');
const path = require('path');

var qsStringify = require('qs/lib/stringify');

console.log(qsStringify({
  a: 1,
  b: 'bb',
  c: [1, 2, 3],
  d: {
    aaa: 1,
    bbb: 2,
  },
  e: [],
}));

// const IMPORT_RE = /(\bimport\s+(?:[^'"]+\s+from\s+)??['"])([^\.\/'"][^\/'"]*)([^'"]*['"])/g;
// const EXPORT_RE = /(\bexport\s+(?:[^'"]+\s+from\s+)??['"])([^\.\/'"][^\/'"]*)([^'"]*['"])/g;
// const REQUIRE_RE = /(\brequire\s*?\(\s*?['"])([^\.\/'"][^\/'"]*)([^'"]*['"]\s*?\))/g;
//
// let code = fs.readFileSync(path.join(__dirname, 'res/testSource.js'), {
//   encoding: 'UTF-8'
// });
//
// console.log(code, '\n');
//
// code = code
//   .replace(IMPORT_RE, function(_0, _1, _2, _3) {
//     console.log('IMPORT_RE ', arguments);
//     return _1 + '1111' + _3;
//   })
//   .replace(EXPORT_RE, function(_0, _1, _2, _3) {
//     console.log('EXPORT_RE ', arguments);
//     return _1 + '1111' + _3;
//   })
//   .replace(REQUIRE_RE, function(_0, _1, _2, _3) {
//     console.log('REQUIRE_RE ', arguments);
//     return _1 + '1111' + _3;
//   });
//
// console.log('\n', code);

// var EventEmitter = require('eventemitter2');
//
// var ee = new EventEmitter({
//
//       //
//       // set this to `true` to use wildcards. It defaults to `false`.
//       //
//       wildcard: true,
//       //
//       // //
//       // // the delimiter used to segment namespaces, defaults to `.`.
//       // //
//       // delimiter: '.',
//       //
//       // //
//       // // set this to `true` if you want to emit the newListener event. The default value is `true`.
//       // //
//       // newListener: false,
//       //
//       // //
//       // // the maximum amount of listeners that can be assigned to an event, default 10.
//       // //
//       // maxListeners: 20
//     });
//
// ee.on('aa', () => {
//   console.log('aa');
// });
//
// ee.on('bb.aa', () => {
//   console.log('bb.aa');
// });
//
// ee.on('aa.**', () => {
//   console.log('aa.**');
// });
//
// ee.on('**.aa', () => {
//   console.log('**.aa');
// });
//
// // ee.emit('aaa');
// // ee.emit('bb.aa');
// ee.emit('aa');
