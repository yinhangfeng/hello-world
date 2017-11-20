'use strict';

const escapeRegExp = require('lodash/escapeRegExp');
const path = require('path');
// @babel 处于beta状态
// const babelRegister = require("@babel/register");
const babelRegister = require('babel-register');

const BABEL_ENABLED_PATHS = ['test.js'];

function buildRegExps(basePath, dirPaths) {
  return dirPaths.map(
    folderPath => new RegExp(
        `^${escapeRegExp(
          path.resolve(basePath, folderPath).replace(/\\/g, '/')
        )}`
      )
  );
}

// node >= 5 的配置
// https://github.com/babel/babel/tree/master/packages/babel-register
babelRegister({
    presets: [
      [
        // https://github.com/babel/babel/tree/master/experimental/babel-preset-env
        // '@babel/preset-env',
        'env',
        {
          "targets": {
            "node": "current"
          },
          // 需要安装 @babel/polyfill babel-polyfill
          "useBuiltIns": "usage",
          // 排除 transform-regenerator 使得支持regenerator的node环境 不需要依赖 regenerator-runtime
          "exclude": ["transform-regenerator"]
        }
      ]
    ],
    plugins: [
      'transform-object-rest-spread',
      'transform-class-properties',
    ],
    // plugins: ['transform-object-rest-spread'],
    only: buildRegExps(__dirname, BABEL_ENABLED_PATHS),
    retainLines: true,
    sourceMaps: 'inline',
    babelrc: false,
});

require('./test');