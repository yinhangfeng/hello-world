const path = require('path');
const RawModule = require('webpack/lib/RawModule');

/**
 * 处理 ignored RawModule
 * https://github.com/webpack/enhanced-resolve/blob/master/lib/AliasFieldPlugin.js#L57
 * https://github.com/webpack/webpack/blob/webpack-4/lib/NormalModuleFactory.js#L243
 * 
 * 比如 https://github.com/pubkey/unload/blob/master/package.json#L89
 * 配置了 browser 项, ignore 了 src/node.js，对 src/node.js 的依赖就会返回 RawModule
 */
function applyRawModule(module) {
  if (!(module instanceof RawModule)) {
    return;
  }

  const [ignored, context, request] = module.identifierStr.split(' ');

  // 还原 module 的 resource
  module.resource = path.resolve(context, request + '.js');
}

module.exports = applyRawModule;
