import produce from 'immer';
import { Action, Reducer, AnyModel, IPlugin, Store } from '../..';

export interface ImmerPluginOptions {}

export default class ImmerPlugin implements IPlugin {
  private options: Required<ImmerPluginOptions>;
  constructor(options: ImmerPluginOptions = {}) {
    this.options = {
      ...options,
    };
  }

  onStoreInit(store: Store) {
    store.config.immer = true;
  }

  onModelInnerReducer(reducer: Reducer, model: AnyModel) {
    if (model.config.immer === false) {
      return reducer;
    }
    return (state: any, action: Action) => {
      if (state === undefined) return reducer(state, action);
      return produce(state, (draft: any) => reducer(draft, action));
    };
  }
}
