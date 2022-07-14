const PMHarmonyImportSideEffectDependency = require('./PMHarmonyImportSideEffectDependency');

// https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyModulesPlugin.js
class PMHarmonyModulesPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compilation, { normalModuleFactory }) {
    const options = this.options;
    compilation.dependencyFactories.set(
      PMHarmonyImportSideEffectDependency,
      normalModuleFactory
    );
    compilation.dependencyTemplates.set(
      PMHarmonyImportSideEffectDependency,
      new PMHarmonyImportSideEffectDependency.Template(
        options.getModuleRequirePath
      )
    );

    const handler = (parser, parserOptions) => {
      if (parserOptions.harmony !== undefined && !parserOptions.harmony) return;

      // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyImportDependencyParserPlugin.js#L29
      // import xxx
      parser.hooks.import.tap('PMHarmonyModulesPlugin', (statement, source) => {
        const sideEffectDep = new PMHarmonyImportSideEffectDependency(
          source,
          statement.source.range,
          parser.state.module
        );
        parser.state.module.addDependency(sideEffectDep);
        return true;
      });

      // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyExportDependencyParserPlugin.js#L133
      // export xxx from
      // 处理方式与 import 相同，不需要 HarmonyExportImportedSpecifierDependency
      parser.hooks.exportImportSpecifier.tap(
        'HarmonyExportDependencyParserPlugin',
        (statement, source, id, name, idx) => {
          if (idx > 0) {
            // export { foo, bar } from 'foobar';
            // 会多次调用 exportImportSpecifier hook，传入递增的 idx (第一次 id: foo, name: foo, idx: 0; 第二次 id: bar, name: bar, idx: 1)
            // PMHarmonyImportSideEffectDependency 只处理 requirePath 替换，不需要添加多个，否则会导致 requirePath 重复替换
            // https://github.com/webpack/webpack/blob/webpack-4/lib/Parser.js#L1325
            return false;
          }
          const sideEffectDep = new PMHarmonyImportSideEffectDependency(
            source,
            statement.source.range,
            parser.state.module
          );
          parser.state.module.addDependency(sideEffectDep);
          return true;
        }
      );
    };

    normalModuleFactory.hooks.parser
      .for('javascript/auto')
      .tap('PMHarmonyModulesPlugin', handler);
    normalModuleFactory.hooks.parser
      .for('javascript/esm')
      .tap('PMHarmonyModulesPlugin', handler);
  }
}

module.exports = PMHarmonyModulesPlugin;
