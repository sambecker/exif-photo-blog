import { fireEvent, render, screen } from '@testing-library/react';
import PhotoLarge from '@/photo/PhotoLarge';
import { parsePhotoFromDb } from '@/photo';
import { AppStateContext } from '@/app/AppState';
import { ShareModalProps } from '@/share';
import { absolutePathForPhoto } from '@/app/path';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: jest.fn() }),
  usePathname: () => '/recipe/test/penphoto',
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('../src/components/image/ImageLarge', () => () => null);
jest.mock('../src/admin/AdminPhotoMenu', () => () => null);
jest.mock('../src/photo/actions', () => ({}));
jest.mock('../src/platforms/storage', () => ({}));
jest.mock('../src/components/MaskedScroll', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('../src/admin/edit-titles/EditTitlesProvider', () => ({
  DATA_KEY_PHOTO_LARGE: 'data-photo-large',
}));
jest.mock('../src/components/image/zoom/ZoomControls', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const key = `om-pen-v1-color-${'a'.repeat(64)}`;
const basePhoto = parsePhotoFromDb({
  id: 'penphoto', url: 'https://photos.example/photo.jpg', extension: 'jpg',
  title: 'Gallery photo', tags: [], aspectRatio: 4 / 3,
  takenAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  takenAtNaive: '2026-10-20 12:00:00', omRecipeKey: key,
});

it.each([
  { name: 'OM', recipe: key, photo: basePhoto },
  { name: 'Fujifilm', recipe: 'kodachrome', photo: {
    ...basePhoto, omRecipeKey: undefined, recipeTitle: 'kodachrome',
  } },
  { name: 'unscoped OM', recipe: undefined, photo: basePhoto },
])('keeps the share scope for $name photos', ({ recipe, photo }) => {
  const setShareModalProps = jest.fn();
  render(<AppStateContext value={{ setShareModalProps }}>
    <PhotoLarge photo={photo} shouldShareRecipe={recipe !== undefined}
      showCamera={false} showLens={false} showFilm={false} showRecipe={false}
      prefetchRelatedLinks={false} />
  </AppStateContext>);
  fireEvent.click(screen.getByRole('button', { name: 'Share Photo' }));
  const [props] = setShareModalProps.mock.calls[0] as [ShareModalProps];
  expect(props.recipe).toBe(recipe);
  expect(absolutePathForPhoto({ ...props, photo }, true)).toContain(recipe
    ? `/recipe/${recipe}/penphoto` : '/p/penphoto');
});
