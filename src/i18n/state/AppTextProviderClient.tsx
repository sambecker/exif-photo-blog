'use client';

import { ReactNode } from 'react';
import { AppTextContext } from './client';
import { I18N } from '..';
import { generateAppTextState } from '.';

export default function AppTextProviderClient({
  children,
  value,
}: {
  children: ReactNode
  value: I18N
}) {
  return (
    <AppTextContext.Provider value={generateAppTextState(value)}>
      {children}
    </AppTextContext.Provider>
  );
}
