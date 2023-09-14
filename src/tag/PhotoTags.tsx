import PhotoTag from '@/tag/PhotoTag';

export default function PhotoTags({
  tags,
}: {
  tags: string[]
}) {
  return (
    <div>
      {tags.map(tag =>
        <PhotoTag
          key={tag}
          tag={tag}
        />)}
    </div>
  );
}
