const ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

class PMHarmonyImportSideEffectDependency extends ModuleDependency {
  constructor(request, range, originModule) {
    super(request);
    this.range = range;
    this.originModule = originModule;
  }
}

module.exports = PMHarmonyImportSideEffectDependency;

PMHarmonyImportSideEffectDependency.Template = class PMHarmonyImportSideEffectDependencyTemplate {
  constructor(getModuleRequirePath) {
    this.getModuleRequirePath = getModuleRequirePath;
  }

  apply(dep, source, runtime) {
    if (!dep.module) {
      // dep 未找到
      // 原处理方式为插入未找到信息
      // https://github.com/webpack/webpack/blob/webpack-4/lib/dependencies/HarmonyImportDependency.js#L106
      // https://github.com/webpack/webpack/blob/webpack-4/lib/RuntimeTemplate.js#L205
      return;
    }
    source.replace(
      dep.range[0] + 1,
      dep.range[1] - 2,
      this.getModuleRequirePath(dep, dep.module, dep.originModule)
    );
  }
};
