const path = require('path');

const projectRoot = path.resolve(__dirname, '../');
const distPath = path.join(projectRoot, 'dist');

module.exports = function emitFileLoader(...args) {
  console.log('emitFileLoader', this.resourcePath);

  const relativeResourcePath = path.relative(this.rootContext, this.resourcePath);
  this.emitFile(relativeResourcePath, args[0]);
  this.callback(null, ...args);
}