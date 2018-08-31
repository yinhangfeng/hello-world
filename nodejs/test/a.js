const b = require('./b');
const fs = require('fs');
const path = require('path');

const xxx = fs.readFileSync(path.join(__dirname, 'b.js'));

setTimeout(() => {
  console.log('xxx');
}, 1000);