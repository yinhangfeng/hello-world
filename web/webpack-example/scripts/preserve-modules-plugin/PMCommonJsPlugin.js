const CommonJsRequireContextDependency = require('webpack/lib/dependencies/CommonJsRequireContextDependency');
const RequireResolveDependency = require('webpack/lib/dependencies/RequireResolveDependency');
const PMCommonJsRequireDependency = require('./PMCommonJsRequireDependency');
const PMCommonJsRequireDependencyParserPlugin = require('./PMCommonJsRequireDependencyParserPlugin');
const NullTemplate = require('./NullTemplate');

// https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/CommonJsPlugin.js
class PMCommonJsPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compilation, { contextModuleFactory, normalModuleFactory }) {
    const options = this.options;
    compilation.dependencyFactories.set(PMCommonJsRequireDependency, normalModuleFactory);
    compilation.dependencyTemplates.set(
      PMCommonJsRequireDependency,
      new PMCommonJsRequireDependency.Template(options.getModuleRequirePath)
    );

    compilation.dependencyFactories.set(CommonJsRequireContextDependency, contextModuleFactory);
    compilation.dependencyTemplates.set(
      CommonJsRequireContextDependency,
      new NullTemplate()
      // TODO
      // new CommonJsRequireContextDependency.Template()
    );

    compilation.dependencyFactories.set(RequireResolveDependency, normalModuleFactory);
    compilation.dependencyTemplates.set(
      RequireResolveDependency,
      // TODO
      new RequireResolveDependency.Template()
    );

    const handler = (parser, parserOptions) => {
      if (parserOptions.commonjs !== undefined && !parserOptions.commonjs) return;

      new PMCommonJsRequireDependencyParserPlugin(options.module).apply(parser);
    };

    normalModuleFactory.hooks.parser.for('javascript/auto').tap('PMCommonJsPlugin', handler);
    normalModuleFactory.hooks.parser.for('javascript/dynamic').tap('PMCommonJsPlugin', handler);
  }
}

module.exports = PMCommonJsPlugin;
