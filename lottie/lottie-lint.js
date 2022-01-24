const linter = require('lottie-lint');

const lottie1 = require('./build/data.json');

const res = linter.default(lottie1);

console.log(res)
