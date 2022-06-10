import { Reducer, AnyModel, IPlugin, Store } from '../..';

export interface TestPluginOptions {}

export default class TestPlugin implements IPlugin {
  private options: Required<TestPluginOptions>;
  constructor(options: TestPluginOptions = {}) {
    this.options = {
      ...options,
    };
  }

  onStoreInit(store: Store) {}
  onStoreCreated(store: Store) {}
  onStoreDestroyed(store: Store) {}
  onModelAttached(model: AnyModel, store: Store) {}
  onModelDetached(model: AnyModel, store: Store) {}
  onModelInnerReducer(reducer: Reducer, model: AnyModel, store: Store) {
    return reducer;
  }
  onModelReducer(reducer: Reducer, model: AnyModel, store: Store) {
    return reducer;
  }
  onReducers(reducers: Record<string, Reducer>, store: Store) {
    return reducers;
  }
  onRootReducer(reducer: Reducer, store: Store) {
    return reducer;
  }
}
