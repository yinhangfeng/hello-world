
/**
 * 什么都不处理的透明 loader
 */
module.exports = function anyLoader(...args) {
  console.log('any loader', this.resourcePath);
  // console.log(Object.keys(this).map(key => {
  //   if (typeof this[key] === 'string') {
  //     return `${key}:  ${this[key]}`;
  //   }
  // }));
  // console.log();
  // console.log();
  // process.exit();
  this.callback(null, ...args);
  // if (this.resourcePath.includes('node_modules/webpack')) {
  //   this.callback(null, ...args);
  //   return;
  // }
  // return '';
}