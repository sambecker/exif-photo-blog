'use client';

import { SWRConfig } from 'swr';

export default function SwrConfigClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <SWRConfig>
    {children}
  </SWRConfig>;
}
