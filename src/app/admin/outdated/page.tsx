import SiteGrid from '@/components/SiteGrid';
import { AI_TEXT_GENERATION_ENABLED } from '@/site/config';
import { getPhotos } from '@/photo/db/query';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import { OUTDATED_THRESHOLD } from '@/photo';
import LoaderButton from '@/components/primitives/LoaderButton';
import IconGrSync from '@/site/IconGrSync';
import Banner from '@/components/Banner';

const UPDATE_BATCH_SIZE = 5;

export default async function AdminPhotosPage() {
  const photos = await getPhotos({
    hidden: 'include',
    sortBy: 'createdAtAsc',
    takenBefore: OUTDATED_THRESHOLD,
    limit: 1_000,
  }).catch(() => []);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <Banner>
            <div className="space-y-1.5">
              These photos {'('}uploaded before
              {' '}
              {new Date(OUTDATED_THRESHOLD).toLocaleDateString()}{')'}
              {' '}
              may have: missing EXIF fields, inaccurate blur data,
              {' '}
              undesired privacy settings,
              {' '}
              and missing AI-generated text.
            </div>
          </Banner>
          <LoaderButton
            icon={<IconGrSync className="translate-y-[1px]" />}
            hideTextOnMobile={false}
            className="primary"
          >
            Sync oldest {UPDATE_BATCH_SIZE} photos
          </LoaderButton>
          <div className="space-y-4">
            <AdminPhotosTable
              photos={photos}
              hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
            />
          </div>
        </div>}
    />
  );
}
