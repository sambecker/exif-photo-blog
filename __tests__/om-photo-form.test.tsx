import { fireEvent, render, screen } from '@testing-library/react';
import PhotoForm from '@/photo/form/PhotoForm';
import { createOmRecipeData } from '@/recipe/serialization';
import { OmRecipe } from '@/platforms/om-system/recipe';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/admin/photos/omphoto1/edit',
  useRouter: () => ({ prefetch: jest.fn() }),
}));
jest.mock('next/form', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    <form aria-label="Photo edit">{children}</form>,
}));
jest.mock('../src/photo/actions', () => ({}));
jest.mock('../src/auth/server', () => ({}));
jest.mock('../src/place/actions', () => ({}));
jest.mock('../src/album/actions', () => ({}));
jest.mock('../src/utility/useMediaQuery', () => ({
  __esModule: true, default: () => false,
}));
jest.mock('../src/utility/useIsVisible', () => ({
  __esModule: true, default: () => true,
}));
jest.mock('../src/utility/useVisibility', () => ({
  __esModule: true, default: jest.fn(),
}));
jest.mock('../src/components/DateTimePicker', () => () => null);
jest.mock('../src/components/image/ImageWithFallback', () => () => null);
jest.mock('../src/platforms/storage', () => ({
  getFileNamePartsFromStorageUrl: () => ({ fileExtension: 'jpg' }),
}));

const recipe: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};

it.each([recipe, undefined])(
  'submits shared OM recipe data through an ordinary title edit', value => {
    const data = JSON.stringify(createOmRecipeData(value));
    const title = value ? `om-v1-color-${'a'.repeat(64)}` : '';
    render(<PhotoForm type="edit" initialPhotoForm={{
      id: 'omphoto1', url: 'https://example.test/photo.jpg', extension: 'jpg',
      title: 'Original title', make: 'OM Digital Solutions', model: 'OM-3',
      aspectRatio: '1.5', recipeTitle: title, recipeData: data,
      takenAt: '2026-10-29T12:00:00Z', takenAtNaive: '2026-10-29 12:00:00',
    }} albums={[]} uniqueTags={[]} uniqueRecipes={[]} uniqueFilms={[]} />);
    fireEvent.change(screen.getByLabelText('title', { exact: true }), {
      target: { value: 'Updated title' },
    });
    const form = screen.getByRole('form', { name: 'Photo edit' });
    const submitted = new FormData(form as HTMLFormElement);
    expect(submitted.get('title')).toBe('Updated title');
    expect(submitted.get('recipeData')).toBe(data);
    expect(submitted.get('recipeTitle')).toBe(title);
    const recipeData = form.querySelector('textarea[name="recipeData"]');
    expect(recipeData).toHaveProperty('readOnly', false);
    if (value) {
      const hash = screen.getByLabelText('auto-title');
      expect(hash).toHaveProperty('checked', true);
      expect(hash).toHaveProperty('disabled', false);
      // Auto-titles render as a single, non-interactive tag
      expect(form.querySelector('#recipeTitle')).toBeNull();
      expect(screen.getByRole('button', { name: `Remove tag "${title}"` }))
        .toHaveProperty('disabled', true);
    } else {
      expect(screen.queryByLabelText('auto-title')).toBeNull();
      expect(form.querySelector('#recipeTitle'))
        .toHaveProperty('readOnly', false);
    }
    expect(form.querySelector('input[name="applyRecipeTitleGlobally"]'))
      .toBeNull();
  },
);

it('omits the hash checkbox for Fujifilm recipes', () => {
  render(<PhotoForm type="edit" initialPhotoForm={{
    id: 'fujiphoto', url: 'https://example.test/photo.jpg', extension: 'jpg',
    make: 'FUJIFILM', model: 'X100VI', aspectRatio: '1.5',
    film: 'classic-chrome', recipeData: JSON.stringify({ highlight: -1 }),
    takenAt: '2026-10-29T12:00:00Z', takenAtNaive: '2026-10-29 12:00:00',
  }} albums={[]} uniqueTags={[]} uniqueRecipes={[]} uniqueFilms={[]} />);
  expect(screen.queryByLabelText('auto-title')).toBeNull();
  expect(document.querySelector('#recipeTitle'))
    .toHaveProperty('readOnly', false);
});

it('leaves the hash checkbox unchecked for custom titles', () => {
  const data = JSON.stringify(createOmRecipeData(recipe));
  render(<PhotoForm type="edit" initialPhotoForm={{
    id: 'omphoto1', url: 'https://example.test/photo.jpg', extension: 'jpg',
    make: 'OM Digital Solutions', model: 'OM-3', aspectRatio: '1.5',
    recipeTitle: 'street-color', recipeData: data,
    takenAt: '2026-10-29T12:00:00Z', takenAtNaive: '2026-10-29 12:00:00',
  }} albums={[]} uniqueTags={[]} uniqueRecipes={[]} uniqueFilms={[]} />);
  const hash = screen.getByLabelText('auto-title');
  expect(hash).toHaveProperty('checked', false);
  expect(hash).toHaveProperty('disabled', false);
  expect(document.querySelector('#recipeTitle'))
    .toHaveProperty('readOnly', false);
  expect(screen.getByRole('button', { name: 'Remove tag "street-color"' }))
    .toHaveProperty('disabled', false);
});
