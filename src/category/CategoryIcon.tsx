import IconAlbum from '@/components/icons/IconAlbum';
import IconCamera from '@/components/icons/IconCamera';
import IconFilm from '@/components/icons/IconFilm';
import IconFocalLength from '@/components/icons/IconFocalLength';
import IconLens from '@/components/icons/IconLens';
import IconRecipe from '@/components/icons/IconRecipe';
import IconRecents from '@/components/icons/IconRecents';
import IconTag from '@/components/icons/IconTag';
import IconYear from '@/components/icons/IconYear';
import { CategoryKey } from '.';

export default function CategoryIcon({
  category,
}: {
  category: CategoryKey
}) {
  switch (category) {
    case 'recents': return <IconRecents size={15} />;
    case 'years': return <IconYear
      size={13}
      className="translate-x-[0.5px]"
    />;
    case 'cameras': return <IconCamera
      size={14}
      className="translate-x-[1px]"
    />;
    case 'lenses': return <IconLens size={15} />;
    case 'albums': return <IconAlbum
      size={13.5}
      className="translate-x-[1.5px]"
    />;
    case 'tags': return <IconTag
      size={13.5}
      className="translate-x-[1.5px] translate-y-[1px]"
    />;
    case 'recipes': return <IconRecipe
      size={16}
      className="translate-x-[-1px]"
    />;
    case 'films': return <IconFilm size={15} />;
    case 'focal-lengths': return <IconFocalLength size={13} />;
  }
}
