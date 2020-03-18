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
    source.replace(
      dep.range[0] + 1,
      dep.range[1] - 2,
      this.getModuleRequirePath(dep, dep.module, dep.originModule)
    );
  }
};
