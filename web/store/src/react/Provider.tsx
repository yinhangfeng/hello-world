import React, { ReactNode } from 'react';
import { Store } from '..';
import { StoreContext } from './Context';

export interface ProviderProps {
  store: Store;
  children: ReactNode;
}

export default function Provider({ store, children }: ProviderProps) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
