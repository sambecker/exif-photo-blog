import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getUniqueTagsWithCountCached } from '@/cache';
import TagForm from '@/tag/TagForm';
import { PATH_ADMIN, PATH_ADMIN_TAGS } from '@/site/paths';

export const runtime = 'edge';

interface Props {
  params: { tag: string }
}

export default async function PhotoPageEdit({ params: { tag } }: Props) {
  const tags = await getUniqueTagsWithCountCached();
  const tagData = tags.find(t => t.tag === tag);

  if (!tagData) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_TAGS}
      backLabel="Tags"
    >
      <TagForm {...tagData} />
    </AdminChildPage>
  );
};
