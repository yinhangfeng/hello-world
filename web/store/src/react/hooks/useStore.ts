import { useContext } from 'react';
import { Store } from '../..';
import { StoreContext } from '../Context';

export function useStore<S>() {
  return useContext(StoreContext) as Store<S>;
}
