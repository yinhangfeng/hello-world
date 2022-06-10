import type { Store } from './Store';
import type { AnyModel } from './Model';
import type { Reducer } from './types';

export interface IPlugin extends PluginHooks {}

export interface PluginHooks {
  onStoreInit?: (store: Store) => void;
  onStoreCreated?: (store: Store) => void;
  onStoreDestroyed?: (store: Store) => void;
  onModelAttached?: (model: AnyModel, store: Store) => void;
  onModelDetached?: (model: AnyModel, store: Store) => void;
  onModelInnerReducer?: (
    reducer: Reducer,
    model: AnyModel,
    store: Store
  ) => Reducer;
  onModelReducer?: (reducer: Reducer, model: AnyModel, store: Store) => Reducer;
  onReducers?: (
    reducers: Record<string, Reducer>,
    store: Store
  ) => Record<string, Reducer>;
  onRootReducer?: (reducer: Reducer, store: Store) => Reducer;
}
