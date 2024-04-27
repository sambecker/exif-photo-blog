'use client';

import { SWRConfig } from 'swr';

export default function SWRConfigClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <SWRConfig>
    {children}
  </SWRConfig>;
}
