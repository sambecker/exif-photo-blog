'use client';

import HttpStatusPage from '@/components/HttpStatusPage';
import { TbRefresh } from 'react-icons/tb';

export default function GlobalError() {
  return (
    <HttpStatusPage status={<TbRefresh />}>
      Something went wrong
    </HttpStatusPage>
  );
}
