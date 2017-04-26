export default function memory(config = {}) {
  const modules = config.modules || {};

  return {
    name: 'simple-memory',
    resolveId(id) {
      console.log('simple-memory resolveId', id);
      return modules[id] && id;
    },
    load(id) {
      console.log('simple-memory load', id);
      return modules[id];
    }
  };
}
