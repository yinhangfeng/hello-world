module.exports = function memory(config = {}) {
  const modules = config.modules || {};

  return {
    name: 'simple-memory',
    resolveId(importee, importer) {
      console.log('simple-memory resolveId', importee, importer);
      // 可以使用Promise
      return Promise.resolve(modules[importee] && importee + 'xxx111');
    },
    load(id) {
      console.log('simple-memory load', id);
      return modules[id.slice(0, id.length - 6)];
    },
    // transformBundle(source, options) {
    //   console.log('transformBundle', source.slice(0, 20) + '......', options);
    //   return {
    //     code: source,
    //   };
    // },
  };
}
