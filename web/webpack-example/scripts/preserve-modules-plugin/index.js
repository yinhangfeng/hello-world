const path = require('path');
const { type } = require('os');
const applyRawModule = require('./applyRawModule');
const PMHarmonyModulesPlugin = require('./PMHarmonyModulesPlugin');
const PMCommonJsPlugin = require('./PMCommonJsPlugin');
const MangleManager = require('./mangle');

// const regexExt = /\.[^\\//]+$/;
// TODO
const regexNodeModules = /node_modules/g;
const parentDirReg = /\.\./g;
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
 * allowEmitOutside: boolean; // 是否允许输出文件到目标文件夹外部(某些依赖可能是在项目文件夹外部的)
 * autoMoveOutsideModules: boolean; // 是否自动将相对于项目外部的依赖移动到项目内部 使用 parentDirReplacement 代表上一级目录
 * parentDirReplacement: string; // 代表上一级目录的字符串 默认 "$$"
 *
 * mainChunk: string; // 主要 chunk 默认为第一个 chunk
 * // 各个 chunk 的配置 key 为 chunk name(entry name)
 * chunks: {
 *   chunkName: {
 *     outputPath: string; // chunk 输出目录，绝对路径或相对于输出目录
 *   };
 * };
 * dependsOnMainChunk: boolean; // 各 chunk 与 main chunk 相同的 module 依赖统一到 mainChunk
 * mangleFilePath: boolean; // 是否混淆输出文件路径，混淆之后相对于输出目录的第一层文件或文件夹名会保留
 * mangleExclude: RegExp[]; // 混淆文件排除正则表达式
 *
 * TODO 在不需要重命名 node_modules 时提供参数保留包名依赖?
 * TODO emitNodeModules
 */
class PreserveModulesPlugin {
  constructor(options) {
    this.options = {
      generateChunkAssets: true,
      emitNodeModules: true,
      nodeModulesName: 'node_modules',
      allowEmitOutside: false,
      autoMoveOutsideModules: false,
      parentDirReplacement: '$$$$',
      fileExt: {
        ts: 'js',
        tsx: 'js',
        jsx: 'js',
      },
      mangleFilePath: false,
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

    if (this.options.mangleFilePath) {
      this.mangle = new MangleManager({
        exclude: this.options.mangleExclude,
      });
    }

    this.getModuleRequirePath = this.getModuleRequirePath.bind(this);
  }

  apply(compiler) {
    const options = this.options;

    compiler.hooks.compilation.tap(
      'PreserveModulesPlugin',
      (compilation, params) => {
        if (compilation.compiler.isChild()) {
          // mini-css-extract-plugin 会使用 childCompiler 不能使用本插件
          return;
        }

        const contextPath = compilation.options.context;
        this.contextPath = contextPath;
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
          compilation.hooks.shouldGenerateChunkAssets.tap(
            'PreserveModulesPlugin',
            () => {
              return false;
            }
          );
        }

        compilation.mainTemplate.hooks.renderManifest.intercept({
          register: (tap) => {
            if (tap.name === 'JavascriptModulesPlugin') {
              // 阻止默认 js bundle 的生成
              // https://github.com/webpack/webpack/blob/webpack-4/lib/JavascriptModulesPlugin.js#L95
              tap.fn = (result, options) => {};
            }
            return tap;
          },
        });

        compilation.hooks.additionalChunkAssets.tap(
          'PreserveModulesPlugin',
          () => {
            const moduleTemplate = compilation.moduleTemplates.javascript;
            const dependencyTemplates = compilation.dependencyTemplates;

            let chunks = compilation.chunks;
            const {
              nodeModulesName,
              allowEmitOutside,
              mainChunk: mainChunkName,
              chunks: chunkConfigs,
              dependsOnMainChunk,
              autoMoveOutsideModules,
              parentDirReplacement,
            } = options;

            let mainChunk;
            if (mainChunkName) {
              const mainChunkIndex = chunks.findIndex(
                (it) => it.name === mainChunkName
              );
              if (mainChunkIndex >= 0) {
                mainChunk = chunks[mainChunkIndex];
                if (mainChunkIndex !== 0) {
                  // 将 mainChunk 放到第一个
                  chunks = chunks.slice();
                  chunks.splice(mainChunkIndex, 1);
                  chunks.unshift(mainChunk);
                }
              }
            }
            this.mainChunk = mainChunk;

            for (const chunk of chunks) {
              const modules = chunk.getModules();
              let chunkConfig = chunkConfigs && chunkConfigs[chunk.name];
              if (!chunkConfig) {
                chunkConfig = {};
              } else if (typeof chunkConfig === 'string') {
                chunkConfig = {
                  outputPath: chunkConfig,
                };
              }
              chunk.$pmChunkConfig = chunkConfig;
              const isMainChunk = chunk === mainChunk;
              if (
                !isMainChunk &&
                mainChunk &&
                (chunkConfig.outputPath || mainChunk.$pmChunkConfig.outputPath)
              ) {
                chunk.$pmOutputPathRelativeToMainChunk = path.relative(
                  chunkConfig.outputPath || '',
                  mainChunk.$pmChunkConfig.outputPath || ''
                );
              }

              // 第一次遍历，处理 module 路径
              for (const module of modules) {
                let skip;
                if (module.constructor.name === 'NormalModule') {
                  skip = false;
                } else if (module.constructor.name === 'RawModule') {
                  if (!module.resource) {
                    skip = !applyRawModule(module);
                  } else {
                    // applyRawModule 处理过的 RawModule 有 resource
                    skip = false;
                  }
                } else {
                  // ContextModule(require('xxx/' + xxx)) CssModule ...
                  skip = true;
                }
                if (skip) {
                  if (module.constructor.name !== 'CssModule') {
                    console.log(
                      'additionalChunkAssets skip module',
                      module.constructor.name,
                      module.resource
                    );
                  }
                  continue;
                }

                let moduleRelativePath = path.relative(
                  contextPath,
                  module.resource
                );

                if (moduleRelativePath.startsWith('..') && !allowEmitOutside) {
                  console.log(
                    'module is outside the project folder',
                    module.resource,
                    contextPath
                  );
                  throw new Error(
                    `module is outside the project folder ${module.resource}`
                  );
                }

                if (nodeModulesName !== 'node_modules') {
                  moduleRelativePath = moduleRelativePath.replace(
                    regexNodeModules,
                    nodeModulesName
                  );
                }

                if (autoMoveOutsideModules) {
                  moduleRelativePath = moduleRelativePath.replace(
                    parentDirReg,
                    parentDirReplacement
                  );
                }

                if (this.mangle) {
                  // console.log('mangle:', moduleRelativePath, '=>', this.mangle.mangle(moduleRelativePath));
                  moduleRelativePath = this.mangle.mangle(moduleRelativePath);
                }

                let relativeOutputPath;
                if (
                  !isMainChunk &&
                  dependsOnMainChunk &&
                  module.isInChunk(mainChunk)
                ) {
                  relativeOutputPath = mainChunk.$pmChunkConfig.outputPath;
                } else {
                  relativeOutputPath = chunkConfig.outputPath;
                }
                if (relativeOutputPath) {
                  moduleRelativePath = path.join(
                    relativeOutputPath,
                    moduleRelativePath
                  );
                }

                // module 的路径代替 module.resource
                module.$pmResource = path.join(contextPath, moduleRelativePath);
                // module 所处的文件夹代替 module.context
                module.$pmContext = path.dirname(module.$pmResource);
              }

              // 第二次遍历，转换 module 里的 require path 路径获取 source 并 emit
              for (const module of modules) {
                if (!module.$pmResource) {
                  // skipped
                  continue;
                }

                let moduleRelativePath = path.relative(
                  contextPath,
                  module.$pmResource
                );
                const ext = path.extname(moduleRelativePath).slice(1);
                if (ext) {
                  if (esExts[ext]) {
                    let newExt = options.fileExt[ext];
                    if (newExt == null) {
                      newExt = options.fileExt.default;
                    }
                    if (newExt != null) {
                      moduleRelativePath =
                        moduleRelativePath.slice(0, -ext.length) + newExt;
                    }
                  } else {
                    // 资源文件增加 js 后缀
                    moduleRelativePath += '.js';
                  }
                }
                if (options.outputPath) {
                  moduleRelativePath = path.join(
                    options.outputPath,
                    moduleRelativePath
                  );
                }

                if (!isMainChunk && module.getNumberOfChunks() > 1) {
                  // module 存在多个 chunk 里
                  if (
                    module.$pmEmittedPaths &&
                    module.$pmEmittedPaths.has(moduleRelativePath)
                  ) {
                    // 该 module 已在其它 chunk 的相同 modulePath emit 过
                    // if (process.env.NODE_ENV === 'development') {
                    //   console.log(
                    //     'additionalChunkAssets module already emitted',
                    //     module.resource,
                    //     modulePath
                    //   );
                    // }
                    continue;
                  }
                }

                if (mainChunk && dependsOnMainChunk && module._cachedSources) {
                  // 清空 module 缓存
                  // 1. 不同 chunk 里 module 生成 source 时可能需要替换成不同的 requirePath
                  // 比如 mainChunk module 依赖关系 1 => 2; bChunk 5 => 4 => 2; cChunk 10 => 4 => 2
                  // bChunk cChunk 有相同的 module 4，且 chunkConfig.outputPath 不同，则 module 4 对 module 2 的 requirePath 可能是不同的，需要重新生成 source
                  // 2. dev 模式代码修改之后 module 可能会移动到 mainChunk 此时依赖该 module 的 module 需要重新生成不同依赖路径的 source
                  // TODO 更准确的识别这种 module 的方案，防止重复生成相同的 source
                  // TODO NormalModule 才有 _cachedSources
                  module._cachedSources.clear();
                }

                module.$pmCurrentSourceChunk = chunk;
                // https://github.com/webpack/webpack/blob/webpack-4/lib/ModuleTemplate.js#L54
                const moduleSource = module.source(
                  dependencyTemplates,
                  moduleTemplate.runtimeTemplate,
                  moduleTemplate.type
                );
                compilation.emitAsset(moduleRelativePath, moduleSource);
                module.$pmCurrentSourceChunk = null;
                if (!module.$pmEmittedPaths) {
                  module.$pmEmittedPaths = new Set();
                }
                module.$pmEmittedPaths.add(moduleRelativePath);
              }
            }

            this.mainChunk = null;
          }
        );
      }
    );

    compiler.hooks.compilation.intercept({
      register: (tap) => {
        if (
          tap.name === 'HarmonyModulesPlugin' ||
          tap.name === 'CommonJsPlugin' ||
          tap.name === 'CommonJsStuffPlugin'
        ) {
          // 去除 HarmonyModulesPlugin CommonJsPlugin CommonJsStuffPlugin
          // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyModulesPlugin.js#L30
          // https://github.com/webpack/webpack/blob/webpack-4/lib/CommonJsStuffPlugin.js#L78
          const originFn = tap.fn;
          tap.fn = (compilation, params) => {
            if (compilation.compiler.isChild()) {
              // childCompiler.hooks 直接复制自 主 complier 所以不能直接去掉 HarmonyModulesPlugin CommonJsPlugin CommonJsStuffPlugin 需要在这里判断
              // MiniCssExtractPlugin 会使用 child compiler
              // https://github.com/webpack/webpack/blob/webpack-4/lib/Compiler.js#L577
              return originFn(compilation, params);
            }
          };
        }
        return tap;
      },
    });
  }

  getModuleRequirePath(dep, module, originModule) {
    let requirePath = path.relative(
      originModule.$pmContext,
      module.$pmResource
    );

    const ext = path.extname(requirePath).slice(1);
    if (ext && esExts[ext]) {
      requirePath = requirePath.slice(0, -(ext.length + 1));
    }
    if (!requirePath.startsWith('.')) {
      requirePath = `./${requirePath}`;
    }

    return requirePath;
  }
}

module.exports = PreserveModulesPlugin;
