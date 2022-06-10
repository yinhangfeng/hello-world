interface PropertyDescriptorWithName extends PropertyDescriptor {
  name: string;
}

/** 获取对象及原型链上的所有方法(不包括构造函数) */
export function getObjectMethods(
  object: any,
  {
    onlyProto,
    endClass = Object,
  }: {
    // 只取实例原型链上的方法
    onlyProto?: boolean;
    // 查找到原型对应的 class 为 endClass 时停止，默认为 Object
    endClass?: any;
  } = {}
) {
  const methods: PropertyDescriptorWithName[] = [];

  let obj =
    onlyProto && object != null ? Object.getPrototypeOf(object) : object;
  let isProto = false;

  while (obj != null && obj.constructor !== endClass) {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    for (const name in descriptors) {
      if (name !== 'constructor') {
        const descriptor = descriptors[name] as PropertyDescriptorWithName;
        if (typeof descriptor.value === 'function') {
          if (isProto && methods.some((it) => it.name === name)) {
            continue;
          }
          descriptor.name = name;
          methods.push(descriptor);
        }
      }
    }
    obj = Object.getPrototypeOf(obj);
    isProto = true;
  }

  return methods;
}
