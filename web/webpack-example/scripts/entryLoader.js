const ModuleDependency = require('webpack/lib/dependencies/ModuleDependency');

module.exports = function(source) {
  console.log('entry loader', this.resourcePath, this.request);

  // this.addDependency('./entryDep');
  // this._module.addDependency(new ModuleDependency('./entryDep'));

  source = `${source}
import './entryDep';
`

  this.callback(null, source);
}