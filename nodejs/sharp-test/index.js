'use strict';

const sharp = require('sharp');



console.time('load');
// let test1 = sharp('test/ctmMAP.jpg');
let test1 = sharp('outputs/output0.png');
console.timeEnd('load');

// let test2 = sharp('outputs/output1.png');
// test2.metadata()
//   .then((metadata) => {
//     console.log(metadata);
//   });

// console.time('resize');
// for (let i = 0; i < 20; ++i) {
//   test1.resize(1000 - i * 30, 1000 - i * 30)
//     .png()
//     .toFile('outputs/output' + i + '.png', function(err) {
//       console.log('finish', i, err);
//     });
// }
// console.timeEnd('resize');

test1.tile({
    size: 256,
  }).toFile('outputs/output.dzi', function(err) {
    console.log('finish', err);
  });
