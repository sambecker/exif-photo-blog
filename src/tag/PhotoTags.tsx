import PhotoTag from '@/tag/PhotoTag';

export default function PhotoTags({
  tags,
}: {
  tags: string[]
}) {
  return (
    <div className="-space-y-0.5">
      {tags.map(tag =>
        <div key={tag}>
          <PhotoTag tag={tag} />
        </div>)}
    </div>
  );
}
