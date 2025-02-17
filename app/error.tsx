'use client';

import HttpStatusPage from '@/components/HttpStatusPage';

export default function Error() {
  return (
    <HttpStatusPage status={500}>
      Something went wrong
    </HttpStatusPage>
  );
}
