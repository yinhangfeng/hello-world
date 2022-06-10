export interface ModelFunctionConfig {
  type: 'reducer' | 'effect';
  // 设置对应的 modelName 默认为当前 model
  model?: string;
  // 设置对应的 actionName 默认为方法名
  actionName?: string;
  // 完整的 action.type 当设置该值之后会忽略 model actionName
  actionType?: string;
  // TODO undoable 可能的情况 1. 执行该 action 之后history不变 2.执行该 action 之后无法回退 history 被清空
  undoable?: boolean;
  [key: string]: any;
}

export type ModelFunctionOptions = ModelFunctionConfig;

function setModelFunctionConfig(func: any, options: ModelFunctionOptions) {
  const modelFunctionConfig: ModelFunctionConfig = {
    ...options,
  };
  func.__modelFunctionConfig = modelFunctionConfig;
}

/** Model 方法的 Decorator */
export function modelMethod(options: ModelFunctionOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // console.log('modelMethod Decorator', target, propertyKey, descriptor);
    const method = descriptor.value;
    if (method) {
      setModelFunctionConfig(method, options);
    }
  };
}

export function reducer<T>(
  options?: Omit<ModelFunctionOptions, 'type'>,
  func?: T
): T extends Function ? T : any {
  const opts = {
    ...options,
    type: 'reducer' as const,
  };
  if (func !== undefined) {
    if (typeof func !== 'function' && process.env.NODE_ENV === 'development') {
      throw new Error('reducer func must be a function');
    }
    setModelFunctionConfig(func, opts);
    return func as any;
  }
  return modelMethod(opts) as any;
}

export function effect<T>(
  options?: Omit<ModelFunctionOptions, 'type'>,
  func?: T
) {
  const opts = {
    ...options,
    type: 'effect' as const,
  };
  if (func !== undefined) {
    if (typeof func !== 'function' && process.env.NODE_ENV === 'development') {
      throw new Error('effect func must be a function');
    }
    setModelFunctionConfig(func, opts);
    return func as any;
  }
  return modelMethod(opts);
}
