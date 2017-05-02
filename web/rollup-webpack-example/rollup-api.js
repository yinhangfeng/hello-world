'use strict';

const path = require('path');
const rollup = require( 'rollup' );

const rollupConfig = require('./rollup.config.js');

rollup.rollup(rollupConfig).then( function ( bundle ) {

  // var result = bundle.generate({
  //   format: 'cjs'
  // });
  // fs.writeFileSync( 'bundle.js', result.code );

  bundle.write({
    format: 'cjs',
    dest: path.join(__dirname, 'dist/rollup-bundle.cjs.js'),
  });
});