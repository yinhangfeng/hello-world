function test1() {
  const target = {
    xxx: 1,
  };

  const ext = {
    yyy: 2,
  };

  Object.defineProperty(ext, 'zzz', {
    enumerable: true,
    get() {
      return 3;
    },
  });

  const targetProxy = new Proxy(target, {
    get: (target, prop) => {
      console.log('Proxy get', prop);
      if (prop in target) {
        return target[prop];
      }
      if (prop in ext) {
        return ext[prop];
      }
    },
    set: (target, prop) => {
      console.log('Proxy set', prop);
      return false;
    },
    has: (target, prop) => {
      console.log('Proxy has', prop);
      if (prop in target) {
        return true;
      }
      return prop in ext;
    },
    ownKeys: (target) => {
      console.log('Proxy ownKeys');
      const res = Object.keys(target).concat(Object.keys(ext));
      console.log(res);
      return res;
    },
    getOwnPropertyDescriptor(target, prop) {
      console.log('Proxy getOwnPropertyDescriptor', prop);
      let desc =
        Object.getOwnPropertyDescriptor(target, prop) || Object.getOwnPropertyDescriptor(ext, prop);
      if (!desc) return desc;

      return {
        ...desc,
        configurable: true,
      };
    },
    isExtensible() {
      return true;
    },
  });

  console.log(Object.isExtensible(target), Object.isExtensible(targetProxy));

  console.log(targetProxy);

  console.log({
    ...targetProxy,
  });

  console.log('xxx' in targetProxy);

  console.log('yyy' in targetProxy);

  console.log('Object.keys(targetProxy)');
  console.log('Object.keys(targetProxy) res:', Object.keys(targetProxy));

  console.log(Object.getOwnPropertyDescriptors(targetProxy));

  console.log(Object.isExtensible(targetProxy));

  targetProxy.yyy = 11;

  console.log(targetProxy, target);

  console.log(JSON.stringify(targetProxy));
}

test1();
