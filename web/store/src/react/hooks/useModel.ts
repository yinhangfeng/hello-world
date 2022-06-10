import { useStore } from './useStore';
import { AnyModel } from '../..';

export function useModel<TModel extends AnyModel = AnyModel>(name: string) {
  const store = useStore();

  return store.getModel<TModel>(name);
}
