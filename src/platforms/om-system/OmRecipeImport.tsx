'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPage from '@/admin/AdminPage';
import ProgressButton from '@/components/primitives/ProgressButton';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { importOmRecipeAction, OmRecipeImportResult } from './actions';

const statusLabels = {
  imported: 'Imported',
  absent: 'Absent or incomplete',
  failed: 'Failed',
};

export default function OmRecipeImport({ photos }: {
  photos: { id: string, title: string | null }[]
}) {
  const [rows] = useState(photos);
  const [results, setResults] =
    useState<Record<string, OmRecipeImportResult>>({});
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useRef(false);
  const router = useRouter();
  const pending = rows.filter(({ id }) =>
    !results[id] || results[id].status === 'failed');

  const run = async () => {
    if (active.current) { return; }
    active.current = true;
    setRunning(true);
    setProgress(0);
    try {
      for (let i = 0; i < pending.length; i++) {
        const { id } = pending[i];
        let result: OmRecipeImportResult;
        try {
          result = await importOmRecipeAction(id);
        } catch {
          result = { photoId: id, status: 'failed',
            message: 'Request failed; retry when connected and signed in' };
        }
        setResults(previous => ({ ...previous, [id]: result }));
        setProgress((i + 1) / pending.length);
      }
    } finally {
      active.current = false;
      setRunning(false);
      router.refresh();
    }
  };

  const completed = Object.values(results);
  const importedCount = completed.filter(r => r.status === 'imported').length;
  const absentCount = completed.filter(r => r.status === 'absent').length;
  const failedCount = completed.filter(r => r.status === 'failed').length;
  return <AdminPage backLabel="Photos" backPath={PATH_ADMIN_PHOTOS}
    breadcrumb="OM recipes"
    accessory={<ProgressButton primary hideText="never"
      isLoading={running} disabled={pending.length === 0}
      progress={running ? progress : 1} onClick={run}>
      {running ? 'Importing…' : pending.length === 0 ? 'All checked' :
        completed.length ? 'Retry failed' : 'Import recipes'}
    </ProgressButton>}>
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-medium">
        Import color and mono recipes from OM SYSTEM and Olympus photos.
        Each original is read once; other photo settings stay unchanged.
        Keep this page open while importing. Finished photos stay processed
        if you return later.
      </p>
      <p role="status" aria-live="polite" className="text-sm">
        {rows.length === 0
          ? 'All OM SYSTEM and Olympus photos have been checked.' :
          `${pending.length} remaining · ` +
          `${importedCount} imported · ${absentCount} absent or incomplete · ` +
          `${failedCount} failed`}
      </p>
      {rows.length > 0 && <div className="max-h-[60vh] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th className="pb-3">Photo</th>
            <th className="pb-3">Result</th></tr></thead>
          <tbody>{rows.map(({ id, title }) => <tr key={id}
            className="border-t border-neutral-200 dark:border-neutral-800">
            <td className="py-3 pr-4">{title || id}</td>
            <td className="py-3">
              {results[id] ? statusLabels[results[id].status] : 'Pending'}
              {results[id]?.message && <div
                className="mt-1 text-xs text-red-600">
                {results[id].message}
              </div>}
            </td>
          </tr>)}</tbody>
        </table>
      </div>}
    </div>
  </AdminPage>;
}
