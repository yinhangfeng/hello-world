import type {
  Action,
  Effect,
  Reducer,
  Dispatch,
  DispatchMethod,
} from './types';
import type { Store } from './Store';

export type ModelConfig<TState extends {} = Record<string, any>> = {
  /** Model 的名字，如果不设置默认会随机产生 */
  name?: string;
  initialState?: TState;
  /** 是否可撤销 */
  undoable?: boolean;
  undoableHistoryStatePrefix?: string;
  immer?: boolean;
  [key: string]: any;
};

export type ModelOptions = Omit<Partial<ModelConfig>, 'initialState'>;

let modelCount = 0;
const computedStateSymbol = Symbol('COMPUTED_STATE');

/** Model 基类 */
export abstract class Model<TModel extends AnyModel, TState extends {}> {
  static readonly config?: ModelConfig<any>;

  readonly name: string;
  readonly config: Readonly<ModelConfig<TState> & { name: string }>;
  readonly store!: Store;
  abstract readonly state: Readonly<TState>;

  private __computedPropertyDescriptors!: Record<string, PropertyDescriptor>;
  private __computed: any;
  private __computedCacheState: any;
  readonly computed: unknown;

  private __combinedState: any;
  private __combinedStateCacheState: any;
  get combinedState(): TState & this['computed'] {
    if (this.computed == null) {
      return this.state;
    }

    if (this.__combinedStateCacheState !== this.state) {
      this.__combinedState = Object.assign({}, this.state);
      Object.defineProperties(
        this.__combinedState,
        this.__computedPropertyDescriptors
      );
      Object.defineProperty(this.__combinedState, computedStateSymbol, {
        enumerable: false,
        configurable: false,
        value: this.state,
      });
      this.__combinedStateCacheState = this.state;
    }
    return this.__combinedState;
  }

  readonly reducers?: Record<string, Reducer>;
  readonly effects?: Record<string, Effect>;

  // @internal
  __reducers!: Record<string, Reducer>;
  // @internal
  __effects!: Record<string, Effect>;
  // @internal
  __reducer!: Reducer<TState>;

  private __listeners?: (() => void)[] & {
    _calling?: boolean;
    _mutated?: boolean;
  };

  constructor(options?: ModelOptions) {
    if (!options) {
      options = (this.constructor as typeof Model).config ?? {};
    }

    // @ts-ignore
    this.name = options.name ?? this.name ?? `model_${modelCount++}`;
    this.config = {
      // @ts-ignore
      ...this.config,
      ...options,
      name: this.name,
    };

    this.subscribe = this.subscribe.bind(this);

    this.__initComputed();
  }

  private __initComputed() {
    const defineComputedGetter = (rawComputed: any) => {
      this.__computedPropertyDescriptors =
        Object.getOwnPropertyDescriptors(rawComputed);
      Object.defineProperty(this, 'computed', {
        enumerable: false,
        get: () => {
          if (this.__computedCacheState !== this.state) {
            this.__computed = Object.defineProperties(
              {},
              this.__computedPropertyDescriptors
            );
            Object.defineProperty(this.__computed, computedStateSymbol, {
              enumerable: false,
              configurable: false,
              value: this.state,
            });
            this.__computedCacheState = this.state;
          }
          return this.__computed;
        },
      });
    };
    if (this.computed != null) {
      defineComputedGetter(this.computed);
    } else {
      Object.defineProperty(this, 'computed', {
        enumerable: false,
        configurable: true,
        set: defineComputedGetter,
      });
    }
  }

  protected onAttach() {}

  protected onDetach() {}

  protected setState<K extends keyof TState>(
    state:
      | ((prevState: TState) => Pick<TState, K> | TState | void)
      | (Pick<TState, K> | TState)
  ) {
    if (!this.store) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Model.setState Model detached!!',
          this.name,
          this.constructor.name
        );
      }
      return;
    }
    this.store.dispatch({
      type: `${this.name}/${SET_STATE_ACTION}`,
      payload: state,
    });
  }

  protected createComputed<
    TGetters extends Record<string, ComputedGetter<TState>>,
    R = {
      readonly [Key in keyof TGetters]: ReturnType<TGetters[Key]>;
    }
  >(getters: TGetters): R {
    const model = this;
    function createPropertyGetter(
      key: string,
      getter: (state: Readonly<TState>, computed: any) => any
    ) {
      function propertyGetter(this: any) {
        const value = getter.call(model, this[computedStateSymbol], this);
        Object.defineProperty(this, key, {
          enumerable: true,
          value,
        });
        return value;
      }

      return propertyGetter;
    }

    const computed: R = {} as any;
    for (const getterKey in getters) {
      const getter = getters[getterKey];
      Object.defineProperty(computed, getterKey, {
        get: createPropertyGetter(getterKey, getter),
        enumerable: true,
        configurable: true,
      });
    }

    return computed;
  }

  clearComputedCache(onlyInvalid?: boolean) {
    if (this.computed == null) {
      return;
    }
    if (!onlyInvalid || this.__computedCacheState !== this.state) {
      this.__computed = undefined;
      this.__computedCacheState = undefined;
    }

    if (!onlyInvalid || this.__combinedStateCacheState !== this.state) {
      this.__combinedState = undefined;
      this.__combinedStateCacheState = undefined;
    }
  }

  // FIXME 是否可以省略掉泛型参数 TModel，TModel 用 typeof this 代替为什么不行?
  dispatch = ((action: Action | string, payload?: any, meta?: any) => {
    if (!this.store) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Model.dispatch Model detached!!',
          this.name,
          this.constructor.name
        );
      }
      return;
    }
    return this.store.dispatch(action, payload, meta);
  }) as Dispatch<TModel, TState>;

  subscribe(listener: () => void) {
    if (!this.__listeners) {
      this.__listeners = [listener];
    } else {
      this.__listeners.push(listener);
    }

    return () => {
      const listeners = this.__listeners!;
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        if (listeners._calling) {
          listeners[index] = emptyFunc;
          listeners._mutated = true;
        } else {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // @internal
  __callListeners() {
    const listeners = this.__listeners;
    if (!listeners) {
      return;
    }
    listeners._calling = true;
    for (let i = 0; i < listeners.length; ++i) {
      listeners[i]();
    }
    if (listeners._mutated) {
      this.__listeners = listeners.filter((it) => it !== emptyFunc);
    } else {
      listeners._calling = false;
    }
  }

  protected reducer?(state: TState, action: Action): TState | void;
  protected onUpdate?(
    nextState: Readonly<TState>,
    prevState: Readonly<TState>
  ): TState | void;
  protected onSave?(state: Readonly<TState>): TState;
  protected onRestore?(state: Readonly<TState>): TState;
}

export type ComputedGetter<TState> = (
  state: Readonly<TState>,
  computed: any
) => any;

export type AnyModel = Omit<Model<any, any>, 'dispatch'> & {
  dispatch: DispatchMethod;
};

function emptyFunc() {}

export const SET_STATE_ACTION = 'SET_STATE_ACTION';

export function setStateReducer(state: Record<string, any>, payload: any): any {
  if (typeof payload === 'function') {
    return payload(state);
  }
  return Object.assign({}, state, payload);
}

export function immerSetStateReducer(
  state: Record<string, any>,
  payload: any
): any {
  if (typeof payload === 'function') {
    return payload(state);
  }
  Object.assign(state, payload);
}
