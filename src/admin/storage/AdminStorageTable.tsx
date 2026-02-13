import { pathForPhoto } from '@/app/path';
import LinkWithStatus from '@/components/LinkWithStatus';
import { Photo } from '@/photo';
import { getPhotoUrls } from '@/photo/query';
import { getStorageUrlsForPhoto } from '@/photo/storage';

export default async function AdminStoragePage() {
  const _urls = await getPhotoUrls({ limit: 1000, hidden: 'include' });

  const urls = await Promise.all(_urls.map(async ({ url, ...partialPhoto }) => {
    const urlSet = await getStorageUrlsForPhoto({ url } as Photo);
    const status = urlSet.length === 4
      ? 'complete'
      : urlSet.length === 0
        ? 'missing'
        : 'partial';
    return { ...partialPhoto, status };
  }));

  const countComplete = urls
    .filter(({ status }) => status === 'complete').length;
  const countPartial = urls
    .filter(({ status }) => status === 'partial').length;
  const countMissing = urls
    .filter(({ status }) => status === 'missing').length;

  return (
    <div className="w-full space-y-4">
      <div className="font-bold">
        Storage ({countComplete + countPartial}/{urls.length})
      </div>
      <div>
        <div>✅ {countComplete.toString().padStart(3, '0')} Complete</div>
        <div>⚠️ {countPartial.toString().padStart(3, '0')} Partial</div>
        <div>❌ {countMissing.toString().padStart(3, '0')} Missing</div>
      </div>
      <div>
        {urls.map(({ id, title, hidden, status }) => (
          <div
            key={id}
          >
            <LinkWithStatus
              href={pathForPhoto({ photo: { id, hidden } as Photo })}
              className="w-full inline-flex items-center gap-1"
            >
              <span className="w-[15rem] inline-block truncate">{title}</span>
              {status === 'complete'
                ? '✅'
                : status === 'partial'
                  ? '⚠️'
                  : '❌'}
            </LinkWithStatus>
          </div>
        ))}
      </div>
    </div>
  );
}
