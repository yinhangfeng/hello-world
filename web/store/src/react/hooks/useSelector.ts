import { useMemo } from 'react';
import { AnyModel, Store } from '../..';
import { useStore } from './useStore';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
// import useSyncExternalStoreWithSelector from 'use-sync-external-store/with-selector';

export type EqualityFn<T> = (a: T, b: T) => boolean;

const refEquality: EqualityFn<any> = (a, b) => a === b;

export function useSelector<TState = any, Selected = unknown>(
  selector: (state: TState, store: Store<TState>) => Selected,
  deps?: any[]
): Selected;

export function useSelector<TState = any, Selected = unknown>(
  selector: (state: TState, store: Store<TState>) => Selected,
  equalityFn?: EqualityFn<Selected>,
  deps?: any[]
): Selected;

export function useSelector<TState = any, Selected = unknown>(
  selector: (state: TState, store: Store<TState>) => Selected,
  equalityFn?: EqualityFn<Selected> | any[],
  deps?: any[]
): Selected {
  if (!equalityFn) {
    equalityFn = refEquality;
  } else if (Array.isArray(equalityFn)) {
    deps = equalityFn;
    equalityFn = refEquality;
  }

  const store = useStore<TState>();
  const [memoSelector, memoEqualityFn] = useMemo(
    () => [
      (state: TState) => {
        return selector(state, store);
      },
      equalityFn as EqualityFn<Selected>,
    ],
    deps ? [...deps, store] : [selector, equalityFn, store]
  );

  return useSyncExternalStoreWithSelector<TState, Selected>(
    store.subscribe,
    store.getState,
    store.getState,
    memoSelector,
    memoEqualityFn
  );
}

export function useModelSelector<
  TState = any,
  Selected = unknown,
  TModel extends AnyModel = AnyModel
>(
  modelName: string,
  selector: (state: TState, model: TModel) => Selected,
  deps?: any[]
): Selected;

export function useModelSelector<
  TState = any,
  Selected = unknown,
  TModel extends AnyModel = AnyModel
>(
  modelName: string,
  selector: (state: TState, model: TModel) => Selected,
  equalityFn?: EqualityFn<Selected>,
  deps?: any[]
): Selected;

export function useModelSelector<
  TState = any,
  Selected = unknown,
  TModel extends AnyModel = AnyModel
>(
  modelName: string,
  selector: (state: TState, model: TModel) => Selected,
  equalityFn?: EqualityFn<Selected> | any[],
  deps?: any[]
): Selected {
  if (!equalityFn) {
    equalityFn = refEquality;
  } else if (Array.isArray(equalityFn)) {
    deps = equalityFn;
    equalityFn = refEquality;
  }

  const store = useStore<any>();
  const model = store.getModel<TModel>(modelName);
  const [memoSelector, memoEqualityFn, getCombinedState] = useMemo(
    () => {
      let getCombinedState: () => any;
      if (model) {
        getCombinedState = (model as any).___getCombinedState;
        if (!getCombinedState) {
          getCombinedState = (model as any).___getCombinedState = () =>
            model.combinedState;
        }
      } else {
        getCombinedState = () => {};
      }

      return [
        (state: TState) => {
          return selector(state, model!);
        },
        equalityFn as EqualityFn<Selected>,
        getCombinedState,
      ];
    },
    deps ? [...deps, model] : [selector, equalityFn, model]
  );

  return useSyncExternalStoreWithSelector<TState, Selected>(
    model ? model.subscribe : emptySubscribe,
    getCombinedState,
    getCombinedState,
    memoSelector,
    memoEqualityFn
  );
}

function emptySubscribe() {
  return () => {};
}
