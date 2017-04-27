export default function memory(config = {}) {
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
    }
  };
}
