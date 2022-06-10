import * as Redux from 'redux';
import { getObjectMethods } from './utils/object';
import {
  Model,
  AnyModel,
  setStateReducer,
  immerSetStateReducer,
  SET_STATE_ACTION,
} from './Model';
import type {
  Action,
  Reducer,
  ConfigRedux,
  DevtoolOptions,
  Effect,
  InitConfigRedux,
} from './types';
import type { IPlugin, PluginHooks } from './Plugin';
import type { ModelFunctionConfig } from './decorators';

export interface StoreOptions {
  name?: string;
  models?: AnyModel[];
  redux?: InitConfigRedux;
  plugins?: IPlugin[];
}

interface StoreConfig {
  redux: ConfigRedux;
  plugins: IPlugin[];
  immer?: boolean;
}

let count = 0;

export class Store<S = any> {
  readonly name: string;
  // @internal
  readonly config: StoreConfig;
  readonly reduxStore: Redux.Store;
  private models = new Map<string, AnyModel>();
  private effects = new Map<string, Effect | (Effect | undefined)[]>();
  private updatedModels: AnyModel[] = [];

  constructor(options: StoreOptions) {
    const { name, models = [], redux } = options;
    const plugins = options.plugins ? options.plugins.slice() : [];

    this.name = name ?? `Store ${count++}`;
    this.config = {
      redux: {
        enhancers: [],
        middlewares: [],
        ...redux,
        devtoolOptions: {
          name: this.name,
          ...redux?.devtoolOptions,
        },
      },
      plugins,
    };

    this.dispatch = this.dispatch.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getState = this.getState.bind(this);
    this.getModelState = this.getModelState.bind(this);

    this.forEachPluginHook('onStoreInit', (onStoreInit) => {
      onStoreInit(this);
    });

    for (const model of models) {
      this.checkModel(model);
      this.models.set(model.name, model);
      this.initModel(model);
    }

    this.reduxStore = this.createReduxStore();

    for (const model of models) {
      this.attachModel(model);
    }

    this.forEachPluginHook('onStoreCreated', (onStoreCreated) => {
      onStoreCreated(this);
    });
  }

  protected forEachPluginHook<Hook extends keyof PluginHooks>(
    hook: Hook,
    callback: (content: NonNullable<PluginHooks[Hook]>) => void
  ) {
    this.config.plugins.forEach((plugin) => {
      if (plugin[hook]) {
        callback(plugin[hook]!.bind(plugin as any) as any);
      }
    });
  }

  private createReduxStore() {
    const reduxConfig = this.config.redux;

    const createStore = reduxConfig.createStore ?? Redux.createStore;
    const rootReducer = this.createRootReducer();
    const initialState = reduxConfig.initialState ?? {};

    const middlewares = Redux.applyMiddleware(...reduxConfig.middlewares);
    const storeEnhancer = this.createEnhancer();
    const compose = reduxConfig.devtoolComposer
      ? reduxConfig.devtoolComposer
      : composeEnhancersWithDevtools(reduxConfig.devtoolOptions);
    const enhancers = compose(
      ...reduxConfig.enhancers,
      middlewares,
      storeEnhancer
    );

    const reduxStore = createStore(rootReducer, initialState, enhancers);
    return reduxStore;
  }

  private createEnhancer(): Redux.StoreEnhancer<any> {
    const effects = this.effects;
    function callEffect(effect: Effect, action: Action) {
      if (Array.isArray(action.args)) {
        return effect(action.payload, action.meta, ...action.args);
      }
      if (action.meta !== undefined) {
        return effect(action.payload, action.meta);
      }
      if (action.payload !== undefined) {
        return effect(action.payload);
      }
      return effect();
    }
    return (createStore: Redux.StoreEnhancerStoreCreator) => {
      return <S, A extends Redux.AnyAction>(
        reducer: Redux.Reducer<S, A>,
        preloadedState?: Redux.PreloadedState<S>
      ) => {
        const store = createStore<any, any>(reducer, preloadedState);

        const storeDispatch = store.dispatch;
        const dispatch = (action: Action): any => {
          if (effects.has(action.type)) {
            let result: any = storeDispatch(action);

            const effect = effects.get(action.type);
            if (Array.isArray(effect)) {
              const effect0 = effect[0];
              if (effect0) {
                result = callEffect(effect0, action);
              }
              for (let i = 1; i < effect.length; ++i) {
                callEffect(effect[i]!, action);
              }
            } else {
              result = callEffect(effect!, action);
            }
            return result;
          }

          return storeDispatch(action);
        };

        store.subscribe(this.onDispatched);

        return {
          ...store,
          dispatch,
        };
      };
    };
  }

  private onDispatched = () => {
    const updatedModels = this.updatedModels;
    for (let i = 0; i < updatedModels.length; ++i) {
      updatedModels[i].__callListeners();
    }
    updatedModels.length = 0;
  };

  private initModel(model: AnyModel) {
    const methods = getObjectMethods(model, {
      onlyProto: true,
      endClass: Model,
    });

    const modelReducers: Record<string, Reducer> = {};
    const modelEffects: Record<string, Effect> = {};

    modelReducers[`${model.name}/${SET_STATE_ACTION}`] =
      model.config.immer ?? this.config.immer
        ? immerSetStateReducer
        : setStateReducer;

    const processModelFunction = (
      func: (...args: any) => any,
      funcName: string,
      funcConfig: ModelFunctionConfig
    ) => {
      let actionType = funcConfig.actionType;
      let isSelfAction: boolean;
      if (actionType) {
        isSelfAction = actionType.startsWith(`${model.name}/`);
      } else {
        const modelName = funcConfig.model ?? model.name;
        actionType = `${modelName}/${funcConfig.actionName ?? funcName}`;
        isSelfAction = modelName === model.name;
      }
      func = func.bind(model);
      (func as any).__modelFunctionConfig = funcConfig;
      const isEffect = funcConfig.type === 'effect';

      if (!isEffect) {
        if (
          process.env.NODE_ENV === 'development' &&
          modelReducers[actionType]
        ) {
          console.error(
            `duplicate reducer!!! model: ${model.name} actionType: ${actionType} func: ${funcName}`,
            model
          );
          return;
        }
        modelReducers[actionType] = func;
      } else {
        if (
          process.env.NODE_ENV === 'development' &&
          modelEffects[actionType]
        ) {
          console.error(
            `duplicate effect!!! model: ${model.name} actionType: ${actionType} func: ${funcName}`,
            model
          );
          return;
        }

        const effect = func;
        modelEffects[actionType] = effect;
        this.addEffect(actionType, effect, isSelfAction);
      }

      if (isSelfAction) {
        (model.dispatch as any)[funcName] = this.createModelActionDispatcher(
          model,
          actionType,
          isEffect
        );
      } else {
        (model.dispatch as any)[funcName] = () => {
          throw new Error(
            `can not dispatch to other model, current model: ${model.name} actionType: ${actionType}`
          );
        };
      }
    };

    for (const method of methods) {
      const funcConfig: ModelFunctionConfig | undefined =
        method.value?.__modelFunctionConfig;
      if (funcConfig) {
        processModelFunction(
          (model as any)[method.name],
          method.name,
          funcConfig
        );
      }
    }

    if (model.reducers) {
      for (const name in model.reducers) {
        const func = model.reducers[name];
        if (typeof func !== 'function') {
          continue;
        }
        let funcConfig: ModelFunctionConfig | undefined = (func as any)
          .__modelFunctionConfig;
        if (funcConfig) {
          if (funcConfig.type !== 'reducer') {
            const message = `invalid reducers function type ${funcConfig.type} model: ${model.name} reducer: ${name}`;
            if (process.env.NODE_ENV === 'development') {
              console.error(message, model);
            }
            throw new Error(message);
          }
        } else {
          funcConfig = {
            type: 'reducer',
          };
        }
        processModelFunction(func, name, funcConfig);
      }
    }

    if (model.effects) {
      for (const name in model.effects) {
        const func = model.effects[name];
        if (typeof func !== 'function') {
          continue;
        }
        let funcConfig: ModelFunctionConfig | undefined = (func as any)
          .__modelFunctionConfig;
        if (funcConfig) {
          if (funcConfig.type !== 'effect') {
            const message = `invalid effects function type: ${funcConfig.type} model: ${model.name} reducer: ${name}`;
            if (process.env.NODE_ENV === 'development') {
              console.warn(message, funcConfig, model);
            }
            throw new Error(message);
          }
        } else {
          funcConfig = {
            type: 'effect',
          };
        }
        processModelFunction(func, name, funcConfig);
      }
    }

    model.__reducers = modelReducers;
    model.__effects = modelEffects;
    model.__reducer = this.createModelReducer(model);
  }

  private attachModel(model: AnyModel) {
    // @ts-ignore
    model.store = this;
    // @ts-ignore
    model.config.initialState = model.state;
    // @ts-ignore
    model.onAttach();

    this.forEachPluginHook('onModelAttached', (onModelAttached) => {
      onModelAttached(model, this);
    });
  }

  private detachModel(model: AnyModel) {
    for (const actionType in model.__effects) {
      const effect = model.__effects[actionType];
      this.removeEffect(actionType, effect);
    }
    // @ts-ignore
    model.__reducers = undefined;
    // @ts-ignore
    model.__effects = undefined;
    // @ts-ignore
    model.__reducer = undefined;

    // TODO 取消所有 model effects

    // @ts-ignore
    model.onDetach();

    // @ts-ignore
    model.clearComputedCache();

    this.forEachPluginHook('onModelDetached', (onModelDetached) => {
      onModelDetached(model, this);
    });

    // @ts-ignore
    model.store = undefined;
  }

  private createModelReducer(model: AnyModel) {
    const modelReducers = model.__reducers;

    // @ts-ignore
    const baseReducer = model.reducer?.bind(model);
    let reducer = (state: AnyModel['state'], action: Action) => {
      if (baseReducer) {
        state = baseReducer(state, action) ?? state;
      }
      if (action.type in modelReducers) {
        if (Array.isArray(action.args)) {
          state = modelReducers[action.type](
            state,
            action.payload,
            action.meta,
            ...action.args
          );
        } else {
          state = modelReducers[action.type](
            state,
            action.payload,
            action.meta
          );
        }
      }

      return state;
    };

    this.forEachPluginHook('onModelInnerReducer', (onModelInnerReducer) => {
      reducer = onModelInnerReducer(reducer, model, this);
    });

    let modelReducer = (state: AnyModel['state'], action: Action) => {
      const nextState = reducer(state ?? model.state, action);
      if (nextState !== state) {
        // @ts-ignore
        model.state = nextState;
        // @ts-ignore
        if (model.onUpdate) {
          // @ts-ignore
          state = model.onUpdate(nextState, state) ?? state;
          // @ts-ignore
          model.state = nextState;
        }

        this.updatedModels.push(model);
      }

      return nextState;
    };

    this.forEachPluginHook('onModelReducer', (onModelReducer) => {
      modelReducer = onModelReducer(modelReducer, model, this);
    });

    return modelReducer;
  }

  private createRootReducer() {
    const {
      rootReducers,
      reducers: externalReducers,
      combineReducers = Redux.combineReducers,
    } = this.config.redux;

    let reducers: Record<string, Reducer> = { ...externalReducers };
    for (const model of this.models.values()) {
      reducers[model.name] = model.__reducer;
    }

    this.forEachPluginHook('onReducers', (onReducers) => {
      reducers = onReducers(reducers, this);
    });

    const combinedReducers = Object.keys(reducers).length
      ? combineReducers(reducers)
      : (state: any) => state;

    let rootReducer = combinedReducers;
    if (rootReducers && Object.keys(rootReducers).length) {
      rootReducer = (state: any, action: Action) => {
        const actionRootReducer = rootReducers[action.type];

        if (actionRootReducer) {
          return combinedReducers(actionRootReducer(state, action), action);
        }

        return combinedReducers(state, action);
      };
    }

    this.forEachPluginHook('onRootReducer', (onRootReducer) => {
      rootReducer = onRootReducer(rootReducer, this);
    });

    return rootReducer;
  }

  private createModelActionDispatcher(
    model: AnyModel,
    actionType: string,
    isEffect: boolean
  ) {
    return Object.assign(
      function dispatcher(payload?: any, meta?: any, ...args: any) {
        const action: Action = { type: actionType };
        if (payload !== undefined) {
          action.payload = payload;
        }
        if (meta !== undefined) {
          action.meta = meta;
        }
        if (args.length) {
          action.args = args;
        }

        const result = model.dispatch(action);

        if (isEffect) {
          return result;
        }
        return model.state;
      },
      {
        isEffect,
      }
    );
  }

  private addEffect(actionType: string, effect: Effect, isSelfEffect: boolean) {
    const effects = this.effects;
    if (effects.has(actionType)) {
      const existsEffect = effects.get(actionType);
      let effectArr: (Effect | undefined)[];
      if (Array.isArray(existsEffect)) {
        effectArr = [...existsEffect];
      } else {
        effectArr = [existsEffect];
      }
      if (isSelfEffect) {
        effectArr[0] = effect;
      } else {
        effectArr.push(effect);
      }
      effects.set(actionType, effectArr);
    } else if (isSelfEffect) {
      effects.set(actionType, effect);
    } else {
      effects.set(actionType, [undefined, effect]);
    }
  }

  private removeEffect(actionType: string, effect: Effect) {
    const effects = this.effects;
    let registeredEffect = effects.get(actionType);
    if (Array.isArray(registeredEffect)) {
      registeredEffect = [...registeredEffect];
      const index = registeredEffect.indexOf(effect);
      if (index === 0) {
        registeredEffect[0] = undefined;
      } else {
        registeredEffect.splice(index, 1);
      }
      if (registeredEffect.every((it) => !it)) {
        effects.delete(actionType);
      } else {
        effects.set(actionType, registeredEffect);
      }
    } else {
      effects.delete(actionType);
    }
  }

  private checkModel(model: AnyModel) {
    if (this.models.has(model.name)) {
      console.error(
        'Store.addModel model already exists!!!',
        model.name,
        model,
        this.models.get(model.name)
      );
      return false;
    }
    if (model.store) {
      console.error(
        'Store.register model already registered to other store!!!',
        model.name,
        model
      );
      return false;
    }
    return true;
  }

  getModelState<TModel extends AnyModel = AnyModel>(
    name: string
  ): TModel['combinedState'] | undefined {
    return this.models.get(name)?.combinedState;
  }

  getState<TState = S>(): TState {
    return this.reduxStore.getState();
  }

  dispatch(action: Action | string, payload?: any, meta?: any): any {
    if (typeof action === 'string') {
      action = {
        type: action,
      };
      if (payload !== undefined) {
        action.payload = payload;
      }
      if (meta !== undefined) {
        action.meta = meta;
      }
    }
    return this.reduxStore.dispatch(action);
  }

  subscribe(listener: () => void) {
    return this.reduxStore.subscribe(listener);
  }

  addModel(model: AnyModel) {
    this.checkModel(model);

    this.models.set(model.name, model);
    this.initModel(model);
    const rootReducer = this.createRootReducer();
    this.reduxStore.replaceReducer(rootReducer);
    this.attachModel(model);
  }

  addModels(models: AnyModel[]) {
    for (const model of models) {
      this.checkModel(model);
      this.models.set(model.name, model);
      this.initModel(model);
    }

    const rootReducer = this.createRootReducer();
    this.reduxStore.replaceReducer(rootReducer);

    for (const model of models) {
      this.attachModel(model);
    }
  }

  removeModel(modelOrName: AnyModel | string) {
    const model =
      typeof modelOrName === 'string'
        ? this.models.get(modelOrName)!
        : modelOrName;
    if (process.env.NODE_ENV === 'development') {
      if (!model || !this.models.has(model.name)) {
        console.warn('Store.unregister model not exists!!!', modelOrName);
        return;
      }
      if (model.store !== this) {
        console.error(
          'Store.unregister model not register on this store!!!',
          modelOrName
        );
        return;
      }
    }

    this.models.delete(model.name);
    const rootReducer = this.createRootReducer();
    this.reduxStore.replaceReducer(rootReducer);
    this.detachModel(model);
  }

  getModel<TModel extends AnyModel = AnyModel>(name: string) {
    return this.models.get(name) as TModel | undefined;
  }

  save() {
    // TODO
  }

  restore() {
    // TODO
  }

  destroy() {
    const models = this.models.values();
    this.models.clear();
    this.effects.clear();
    this.reduxStore.replaceReducer((state) => state);
    for (const model of models) {
      this.detachModel(model);
    }

    this.forEachPluginHook('onStoreDestroyed', (onStoreDestroyed) => {
      onStoreDestroyed(this);
    });
  }
}

/**
 * Returns Redux Devtools compose method unless it's disabled, in which case it
 * returns default Redux.compose.
 */
function composeEnhancersWithDevtools(
  devtoolOptions: DevtoolOptions = {}
): (...args: any[]) => Redux.StoreEnhancer {
  return !devtoolOptions.disabled &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : Redux.compose;
}
