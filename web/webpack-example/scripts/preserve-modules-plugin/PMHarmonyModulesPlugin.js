const PMHarmonyImportSideEffectDependency = require('./PMHarmonyImportSideEffectDependency');

// https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyModulesPlugin.js
class PMHarmonyModulesPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compilation, { normalModuleFactory }) {
    const options = this.options;
    compilation.dependencyFactories.set(PMHarmonyImportSideEffectDependency, normalModuleFactory);
    compilation.dependencyTemplates.set(
      PMHarmonyImportSideEffectDependency,
      new PMHarmonyImportSideEffectDependency.Template(options.getModuleRequirePath)
    );

    const handler = (parser, parserOptions) => {
      if (parserOptions.harmony !== undefined && !parserOptions.harmony) return;

      parser.hooks.import.tap('PMHarmonyModulesPlugin', (statement, source) => {
        // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyImportDependencyParserPlugin.js#L29
        const sideEffectDep = new PMHarmonyImportSideEffectDependency(
          source,
          statement.source.range,
          parser.state.module
        );
        parser.state.module.addDependency(sideEffectDep);
        return true;
      });
    };

    normalModuleFactory.hooks.parser.for('javascript/auto').tap('PMHarmonyModulesPlugin', handler);
    normalModuleFactory.hooks.parser.for('javascript/esm').tap('PMHarmonyModulesPlugin', handler);
  }
}

module.exports = PMHarmonyModulesPlugin;
