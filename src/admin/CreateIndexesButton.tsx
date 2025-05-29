'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { createPerformanceIndexesAction } from './actions';
import { toastSuccess, toastError } from '@/toast';

export default function CreateIndexesButton() {
  return (
    <form
      action={async () => {
        try {
          await createPerformanceIndexesAction();
          toastSuccess('Database indexes created successfully');
        } catch (error) {
          toastError('Failed to create indexes: ' + (error as Error).message);
        }
      }}
    >
      <SubmitButtonWithStatus confirmText="Create database indexes? This may take a few seconds.">
        Create Performance Indexes
      </SubmitButtonWithStatus>
    </form>
  );
}