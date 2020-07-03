const path = require('path');
const ContextModule = require('webpack/lib/ContextModule');
const NormalModule = require('webpack/lib/NormalModule');
const PMHarmonyModulesPlugin = require('./PMHarmonyModulesPlugin');
const PMCommonJsPlugin = require('./PMCommonJsPlugin');

const regexExt = /\.[^\\//]+$/;
const esExts = {
  js: true,
  jsx: true,
  ts: true,
  tsx: true,
  mjs: true,
};

/**
 * options:
 * generateChunkAssets: boolean;
 * emitNodeModules: boolean;
 * nodeModulesName: string;
 * fileExt: string | {
 *   [key: string]: string;
 * };
 * outputPath: string; // 输出文件夹，相对于 webpack outputPath
 * TODO 在不需要重命名 node_modules 时提供参数保留包名依赖?
 */
class PreserveModulesPlugin {
  constructor(options) {
    this.options = {
      generateChunkAssets: true,
      emitNodeModules: true,
      nodeModulesName: 'node_modules',
      fileExt: {
        ts: 'js',
        tsx: 'js',
        jsx: 'js',
      },
      ...options,
    };

    if (typeof this.options.fileExt === 'string') {
      this.options.fileExt = {
        default: this.options.fileExt,
      };
    }
    if (this.options.nodeModulesName !== 'node_modules') {
      this.options.moveNodeModules = true;
    }
  }

  apply(compiler) {
    const options = this.options;

    compiler.hooks.compilation.tap('PreserveModulesPlugin', (compilation, params) => {
      if (compilation.compiler.isChild()) {
        // mini-css-extract-plugin 会使用 childCompiler 不能使用本插件
        return;
      }

      const contextPath = compilation.options.context;
      this.nodeModulesPath = path.join(contextPath, 'node_modules');

      new PMHarmonyModulesPlugin({
        getModuleRequirePath: this.getModuleRequirePath,
        module: compiler.options.module,
      }).apply(compilation, params);
      new PMCommonJsPlugin({
        getModuleRequirePath: this.getModuleRequirePath,
        module: compiler.options.module,
      }).apply(compilation, params);

      // 阻止默认 thunk 生成
      if (!options.generateChunkAssets) {
        compilation.hooks.shouldGenerateChunkAssets.tap('PreserveModulesPlugin', () => {
          return false;
        });
      }

      compilation.mainTemplate.hooks.renderManifest.intercept({
        register: tap => {
          if (tap.name === 'JavascriptModulesPlugin') {
            // 阻止默认 js bundle 的生成
            // https://github.com/webpack/webpack/blob/webpack-4/lib/JavascriptModulesPlugin.js#L95
            tap.fn = (result, options) => {};
          }
          return tap;
        },
      });

      compilation.hooks.additionalChunkAssets.tap('PreserveModulesPlugin', () => {
        const moduleTemplate = compilation.moduleTemplates.javascript;
        const dependencyTemplates = compilation.dependencyTemplates;

        for (const chunk of compilation.chunks) {
          const modules = chunk.getModules();
          for (const module of modules) {
            if (!(module instanceof NormalModule)) {
              continue;
            }
            // if (typeof module.source !== 'function') {
            //   // https://github.com/webpack/webpack/blob/webpack-4/lib/JavascriptModulesPlugin.js#L88
            //   // CssModule
            //   continue;
            // }
            // if (module instanceof ContextModule) {
            //   // require('xxx/' + xxx)
            //   continue;
            // }
            // const moduleSource = moduleTemplate.render(module, dependencyTemplates, {
            //   chunk
            // });
            // https://github.com/webpack/webpack/blob/webpack-4/lib/ModuleTemplate.js#L54
            const moduleSource = module.source(
              dependencyTemplates,
              moduleTemplate.runtimeTemplate,
              moduleTemplate.type
            );

            let modulePath = path.relative(contextPath, module.resource);
            if (options.moveNodeModules && modulePath.startsWith('node_modules')) {
              modulePath = `${options.nodeModulesName}${modulePath.slice(12)}`;
            }
            const ext = path.extname(modulePath).slice(1);
            if (ext) {
              if (esExts[ext]) {
                let newExt = options.fileExt[ext];
                if (newExt == null) {
                  newExt = options.fileExt.default;
                }
                if (newExt != null) {
                  modulePath = modulePath.slice(0, -ext.length) + newExt;
                }
              } else {
                // 资源文件增加 js 后缀
                modulePath += '.js';
              }
            }
            if (options.outputPath) {
              modulePath = path.join(options.outputPath, modulePath);
            }
            compilation.emitAsset(modulePath, moduleSource);
          }
        }
      });
    });

    compiler.hooks.compilation.intercept({
      register: tap => {
        if (tap.name === 'HarmonyModulesPlugin' || tap.name === 'CommonJsPlugin') {
          // 去除 HarmonyModulesPlugin CommonJsPlugin
          // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyModulesPlugin.js#L30
          const originFn = tap.fn;
          tap.fn = (compilation, params) => {
            if (compilation.compiler.isChild()) {
              // childCompiler.hooks 直接复制自 主 complier 所以不能直接去掉 HarmonyModulesPlugin CommonJsPlugin 需要在这里判断
              // https://github.com/webpack/webpack/blob/webpack-4/lib/Compiler.js#L577
              return originFn(compilation, params);
            }
          };
        }
        return tap;
      },
    });
  }

  getModuleRequirePath = (dep, module, originModule) => {
    const { moveNodeModules, nodeModulesName } = this.options;

    let requirePath = path.relative(originModule.context, module.resource);
    const ext = path.extname(requirePath).slice(1);
    if (ext) {
      if (esExts[ext]) {
        requirePath = requirePath.slice(0, -(ext.length + 1));
      }
    }
    if (!requirePath.startsWith('.')) {
      requirePath = `./${requirePath}`;
    }
    if (
      moveNodeModules &&
      module.resource.startsWith(this.nodeModulesPath) &&
      !originModule.context.startsWith(this.nodeModulesPath)
    ) {
      // TODO node_modules 可能在某个文件名上
      requirePath = requirePath.replace('node_modules', nodeModulesName);
    }

    return requirePath;
  };
}

module.exports = PreserveModulesPlugin;
