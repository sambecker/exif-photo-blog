'use client';

import { ReactNode } from 'react';
import { AppTextContext } from './client';
import { I18N } from '..';
import { generateI18NState } from '.';

export default function AppTextProviderClient({
  children,
  value,
}: {
  children: ReactNode
  value: I18N
}) {
  return (
    <AppTextContext.Provider value={generateI18NState(value)}>
      {children}
    </AppTextContext.Provider>
  );
}
