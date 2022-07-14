const path = require('path');

/**
 * 处理 ignored RawModule
 * https://github.com/webpack/enhanced-resolve/blob/master/lib/AliasFieldPlugin.js#L57
 * https://github.com/webpack/webpack/blob/webpack-4/lib/NormalModuleFactory.js#L243
 *
 * 比如 https://github.com/pubkey/unload/blob/master/package.json#L89
 * 配置了 browser 项, ignore 了 src/node.js，对 src/node.js 的依赖就会返回 RawModule
 */
function applyRawModule(module) {
  if (module.constructor.name !== 'RawModule') {
    return false;
  }

  const identifierArr = module.identifierStr.split(' ');
  const [ignored, context, request] = identifierArr;

  if (ignored !== 'ignored' && identifierArr.length !== 3) {
    return false;
  }

  // 还原 module 的 resource
  module.resource = path.resolve(context, request);
  if (!module.resource.endsWith('.js')) {
    module.resource += '.js';
  }
  return true;
}

module.exports = applyRawModule;
