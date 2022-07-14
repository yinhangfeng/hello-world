const ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

class PMCommonJsRequireDependency extends ModuleDependency {
  constructor(request, range, originModule) {
    super(request);
    this.range = range;
    this.originModule = originModule;
  }
}

module.exports = PMCommonJsRequireDependency;

PMCommonJsRequireDependency.Template = class PMCommonJsRequireDependencyTemplate {
  constructor(getModuleRequirePath) {
    this.getModuleRequirePath = getModuleRequirePath;
  }

  apply(dep, source, runtime) {
    if (!dep.range) return;
    if (!dep.module) {
      return;
    }
    if (!dep.originModule.context) {
      return;
    }
    source.replace(
      dep.range[0] + 1,
      dep.range[1] - 2,
      this.getModuleRequirePath(dep, dep.module, dep.originModule)
    );
  }
};
