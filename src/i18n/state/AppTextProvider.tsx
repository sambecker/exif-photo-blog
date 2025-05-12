import { ReactNode } from 'react';
import { getTextForLocale } from '..';
import { APP_LOCALE } from '@/app/config';
import AppTextProviderClient from './AppTextProviderClient';

export default async function AppTextProvider({
  children,
}: {
  children: ReactNode
}) {
  const value = await getTextForLocale(APP_LOCALE);
  return (
    <AppTextProviderClient {...{ value }}>
      {children}
    </AppTextProviderClient>
  );
}
