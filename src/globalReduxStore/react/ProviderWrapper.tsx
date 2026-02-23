import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { nesineGlobalReduxManager } from '../globalReduxManager';

export const globalReduxWrapProvider = (children: ReactNode) => (
  <Provider store={nesineGlobalReduxManager.store}>{children}</Provider>
);

interface GlobalReduxProviderProps {
  children: ReactNode;
}
export const GlobalReduxProvider = ({ children }: GlobalReduxProviderProps) => (
  <Provider store={nesineGlobalReduxManager.store}>{children}</Provider>
);
