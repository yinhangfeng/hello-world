import { Store, Action, Reducer, AnyModel, IPlugin } from '../..';
import {
  clear,
  createDQueue,
  DQueue,
  getCurrent,
  moveCurrent,
  pushCurrent,
  set,
  setCurrent,
} from './dqueue';
import { ActionTypes, ActionCreators } from './actions';

export {
  ActionTypes as UndoableActionTypes,
  ActionCreators as UndoableActionCreators,
};

type UndoableStoreInternal = Store & {
  __undoableHistoryReducers?: Record<string, Reducer>;
};

export interface UndoablePluginOptions {
  limit?: number;
  historyStatePrefix?: string;
  undoType?: string;
  redoType?: string;
  jumpType?: string;
  clearHistoryType?: string;
  filter?: IUndoableHooks['undoableFilter'];
  group?: IUndoableHooks['undoableGroup'];
  neverSkipReducer?: boolean;
}

export interface IUndoableHooks<TState = any> {
  undoableOnPush?(state: TState): TState | void;
  undoableOnPop?(
    nextState: TState,
    prevState: TState,
    n: number
  ): TState | void;
  undoableFilter?(
    action: Action,
    state: TState,
    history: UndoableHistory
  ): boolean;
  undoableGroup?(action: Action, state: TState, history: UndoableHistory): any;
}

export interface UndoableHistory extends DQueue {
  group?: any;
}

/** TODO 考虑将 history 放入单独的 HistoryModel NOTE: UndoablePlugin 必须置于 ImmerPlugin 之后 */
export default class UndoablePlugin implements IPlugin {
  private options: Required<UndoablePluginOptions>;
  constructor(options: UndoablePluginOptions = {}) {
    this.options = {
      limit: 1000,
      historyStatePrefix: '@@undoable_',
      undoType: ActionTypes.UNDO,
      redoType: ActionTypes.REDO,
      jumpType: ActionTypes.JUMP,
      clearHistoryType: ActionTypes.CLEAR_HISTORY,
      filter: () => true,
      group: () => undefined,
      neverSkipReducer: true,
      ...options,
    };
  }

  onStoreInit(store: UndoableStoreInternal) {
    store.__undoableHistoryReducers = {};
  }

  onModelInnerReducer(
    reducer: Reducer,
    model: AnyModel,
    store: UndoableStoreInternal
  ) {
    if (!model.config.undoable) {
      return reducer;
    }
    const undoableModel = model as AnyModel & IUndoableHooks;
    const undoableHistoryReducers = store.__undoableHistoryReducers!;
    const {
      limit,
      historyStatePrefix,
      undoType,
      redoType,
      jumpType,
      clearHistoryType,
      neverSkipReducer,
    } = this.options;
    const modelUndoType = `${model.name}/${undoType}`;
    const modelRedoType = `${model.name}/${redoType}`;
    const modelJumpType = `${model.name}/${jumpType}`;
    const modelClearHistoryType = `${model.name}/${clearHistoryType}`;

    const undoableFilter = undoableModel.undoableFilter
      ? undoableModel.undoableFilter.bind(model)
      : this.options.filter;

    const undoableGroup = undoableModel.undoableGroup
      ? undoableModel.undoableGroup.bind(model)
      : this.options.group;

    // TODO 初始 history (rootReducer 获取 state)
    let history: UndoableHistory = createDQueue(limit);

    function jump(n: number) {
      const prevState = getCurrent(history);
      const prevStateIndex = history.current;
      if (moveCurrent(history, n)) {
        let nextState = getCurrent(history);
        if (undoableModel.undoableOnPop) {
          const state = undoableModel.undoableOnPop(nextState, prevState, n);
          if (state !== undefined) {
            nextState = state;
            setCurrent(history, nextState);
          }
        }
        if (undoableModel.undoableOnPush) {
          const pushState = undoableModel.undoableOnPush(prevState);
          if (pushState !== undefined) {
            set(history, prevStateIndex, pushState);
          }
        }
        history = { ...history, group: undefined };
      }
      return getCurrent(history);
    }

    function clearHistory() {
      const current = getCurrent(history);
      clear(history);
      setCurrent(history, current);
    }

    function updateCurrent(state: any, group?: any) {
      setCurrent(history, state);
      history = {
        ...history,
        group: group === undefined ? history.group : group,
      };
    }

    function push(state: any, group: any) {
      if (undoableModel.undoableOnPush) {
        const pushState = undoableModel.undoableOnPush(getCurrent(history));
        if (pushState !== undefined) {
          setCurrent(history, pushState);
        }
      }
      pushCurrent(history, state);
      history = { ...history, group };
    }

    const skipReducer = neverSkipReducer
      ? (state: any, action: Action, ...restArgs: any) => {
          const nextState = reducer(state, action, ...restArgs);
          if (nextState !== state) {
            updateCurrent(nextState);
          }
          return nextState;
        }
      : (state: any) => state;

    const undoableReducer = (state: any, action: Action, ...restArgs: any) => {
      // TODO 考虑 history 里面不要保存 current，因为 current 无法保证是最新的，undoable 插件外层插件或者 Model.onUpdate 可能会改变 state 而本插件无法感知
      if (state !== getCurrent(history)) {
        updateCurrent(state);
      }

      switch (action.type) {
        case undoType:
        case modelUndoType:
          return skipReducer(jump(-1), action, ...restArgs);
        case redoType:
        case modelRedoType:
          return skipReducer(jump(1), action, ...restArgs);
        case jumpType:
        case modelJumpType:
          return skipReducer(jump(action.payload), action, ...restArgs);
        case clearHistoryType:
        case modelClearHistoryType:
          clearHistory();
          return state;
      }

      const nextState = reducer(state, action, ...restArgs);

      if (nextState === state) {
        return nextState;
      }

      if (undoableFilter(action, nextState, history) === false) {
        updateCurrent(nextState);
        return nextState;
      }

      const group = undoableGroup(action, nextState, history);

      if (group != null && group === history.group) {
        updateCurrent(nextState);
        return nextState;
      }

      if (state === undefined) {
        updateCurrent(nextState, group);
      } else {
        push(nextState, group);
      }

      return nextState;
    };

    undoableHistoryReducers[
      `${model.config.undoableHistoryStatePrefix ?? historyStatePrefix}${
        model.name
      }`
    ] = () => history;

    return undoableReducer;
  }

  onReducers(reducers: Record<string, Reducer>, store: UndoableStoreInternal) {
    Object.assign(reducers, store.__undoableHistoryReducers);
    return reducers;
  }

  onStoreDestroyed(store: UndoableStoreInternal) {
    delete store.__undoableHistoryReducers;
  }
}
