import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PhotoLarge from '@/photo/PhotoLarge';
import { parsePhotoFromDb } from '@/photo';
import { AppStateContext } from '@/app/AppState';
import { ShareModalProps } from '@/share';
import { absolutePathForPhoto } from '@/app/path';
import RecipeHeader from '@/recipe/RecipeHeader';
import { OmRecipe } from '@/platforms/om-system/recipe';
import { createOmRecipeData } from '@/recipe/serialization';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: jest.fn() }),
  usePathname: () => '/recipe/test/penphoto',
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('../src/components/image/ImageLarge', () => () => null);
jest.mock('../src/utility/useMediaQuery', () => ({
  __esModule: true, default: () => true,
}));
jest.mock('../src/photo/PhotoHeader', () => ({
  __esModule: true,
  default: ({ entity }: { entity: React.ReactNode }) => <>{entity}</>,
}));
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
  takenAtNaive: '2026-10-20 12:00:00', recipeTitle: key,
});

const profile: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};

it.each([[14, 28], [17, 34], [25, 50]])(
  'shows native %imm alongside its %imm equivalent', (focal, equivalent) => {
    const photo = parsePhotoFromDb({
      id: 'focal', url: 'https://photos.example/focal.jpg', extension: 'jpg',
      tags: [], aspectRatio: 4 / 3,
      takenAt: basePhoto.takenAt, createdAt: basePhoto.createdAt,
      updatedAt: basePhoto.updatedAt, takenAtNaive: basePhoto.takenAtNaive,
      focalLength: focal,
      focalLengthIn35MmFormat: equivalent,
    });
    render(<AppStateContext value={{ supportsHover: false }}>
      <PhotoLarge photo={photo} showCamera={false} showLens={false}
        showFilm={false} showRecipe={false} prefetchRelatedLinks={false} />
    </AppStateContext>);
    expect(screen.getByRole('link', { name: `${focal}mm` })).toBeDefined();
    expect(screen.getByRole('button', { name: `${equivalent}mm` }))
      .toBeDefined();
  },
);

it.each([
  { name: 'OM', recipe: key, photo: basePhoto },
  { name: 'Fujifilm', recipe: 'kodachrome', photo: {
    ...basePhoto, recipeTitle: 'kodachrome',
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

it.each(['photo', 'gallery', 'selected gallery'] as const)(
  'passes the source camera to the %s recipe dialog', async source => {
    const photo = { ...basePhoto, make: 'OLYMPUS CORPORATION', model: 'E-P7',
      recipeData: createOmRecipeData(profile) };
    const firstPhoto = { ...photo, id: 'firstone',
      make: 'OM Digital Solutions', model: 'PEN' };
    render(<AppStateContext value={{}}>
      {source === 'photo'
        ? <PhotoLarge photo={photo} showRecipe showCamera={false}
          showLens={false} showFilm={false} prefetchRelatedLinks={false} />
        : <RecipeHeader recipe={key.replace(/^om-pen-/, 'om-')}
          photos={[firstPhoto, photo]}
          selectedPhoto={source === 'selected gallery' ? photo : undefined} />}
    </AppStateContext>);
    fireEvent.click(screen.getByRole('button', {
      name: 'Show color recipe settings',
    }));
    expect(screen.getByText(source === 'gallery'
      ? 'OM Digital Solutions PEN · Settings used for this photo'
      : 'OLYMPUS CORPORATION E-P7 · Settings used for this photo'))
      .toBeDefined();
    if (source === 'photo') {
      const toggle = screen.getByRole('button', {
        name: 'Hide color recipe settings',
      });
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      fireEvent.click(toggle);
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(screen.getByRole('button', {
        name: 'Show color recipe settings',
      }).getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(screen.getByRole('button', {
        name: 'Show color recipe settings',
      }));
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
  },
);
