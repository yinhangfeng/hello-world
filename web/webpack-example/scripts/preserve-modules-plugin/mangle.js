const path = require('path');

// const chars =
//   '0123456789abcdefghijklmnopqrstuvwxyz_-';

const firstDirReg = /^[/\\]?([^/\\]+)[/\\]/;

function toMangleString(number) {
  // const radix = chars.length;
  // const arr = [];
  // let mod;
  // do {
  //   mod = number % radix;
  //   number = (number - mod) / radix;
  //   arr.unshift(chars[mod]);
  // } while (number);
  // return arr.join('');
  return number.toString(36);
}

class MangleManager {
  constructor({ exclude } = {}) {
    this._exclude = exclude;
    this._mangleMap = new Map();
    this._id = 0;
  }

  shouldMangle(filePath) {
    if (this._exclude) {
      for (const excludeReg of this._exclude) {
        if (excludeReg.test(filePath)) {
          return false;
        }
      }
    }
    return true;
  }

  mangle(filePath) {
    let result = this._mangleMap.get(filePath);
    if (!result) {
      if (!this.shouldMangle(filePath)) {
        result = filePath;
      } else {
        const matched = filePath.match(firstDirReg);
        if (!matched) {
          // 不在文件夹里，第一层文件名需要保留所以直接输出原始路径
          result = filePath;
        } else {
          result = toMangleString(this._id++);
          // 保留第一层文件夹名
          result = matched[0] + result;
          // 保留扩展名
          result += path.extname(filePath);
        }
      }

      this._mangleMap.set(filePath, result);
    }

    return result;
  }
}

module.exports = MangleManager;

// TEST
// for (let i = 0; i < 100; ++i) {
//   console.log(toMangleString(i));
// }
// const mangle = new MangleManager({
//   exclude: [/^src[\\/]/, /^exclude[\/\\].+/, /^aaa\/bbb\/exclude[\/\\].+/],
// });
// console.log(mangle.mangle('aaa'));
// console.log(mangle.mangle('aaa.js'));
// console.log(mangle.mangle('../aaa.js'));
// console.log(mangle.mangle('$$$$/aaa.js'));
// console.log(mangle.mangle('aaa/bbb/ccc/ddd.js'));
// console.log(mangle.mangle('aaa/bbb/ccc/ddd.css.js'));
// console.log(mangle.mangle('aaa/bbb/ccc/ddd.css.js'));
// console.log(mangle.mangle('/adfa/badfad/aadfa.js'));
// console.log(mangle.mangle('/adfa/badfad/aadfaa'));
// console.log(mangle.mangle('exclude/aaa/bbb/ccc.js'));
// console.log(mangle.mangle('aaa/bbb/exclude/ccc.js'));
// console.log(mangle.mangle('aaa/bbb/exclude/ccc/ddd.js'));
