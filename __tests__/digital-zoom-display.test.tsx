import { fireEvent, render, screen } from '@testing-library/react';
import PhotoLarge from '@/photo/PhotoLarge';
import PhotoExpressive from '@/photo/PhotoExpressive';
import { parsePhotoFromDb } from '@/photo';
import { AppStateContext } from '@/app/AppState';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: jest.fn() }),
  usePathname: () => '/p/zoomtest',
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock('../src/components/image/ImageLarge', () => () => null);
jest.mock('../src/place/PlaceMap', () => () => null);
jest.mock('../src/utility/useMediaQuery', () => ({
  __esModule: true, default: () => true,
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

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const basePhoto = parsePhotoFromDb({
  id: 'zoomtest', url: 'https://photos.example/zoom.jpg', extension: 'jpg',
  title: 'Zoom photo', tags: [], aspectRatio: 4 / 3,
  takenAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  takenAtNaive: '2026-11-01 12:00:00',
});

describe.each([PhotoLarge, PhotoExpressive])('digital zoom', PhotoComponent => {
  it.each([2, 1.4])('shows %s× beside the native focal length', ratio => {
    const photo = parsePhotoFromDb({
      ...basePhoto, focalLength: 17, digitalZoomRatio: ratio,
    });
    render(<AppStateContext value={{ supportsHover: false }}>
      <PhotoComponent photo={photo} prefetchRelatedLinks={false} />
    </AppStateContext>);
    const zoom = screen.getByRole('button', { name: `${ratio}×` });
    expect(zoom.closest('li'))
      .toBe(screen.getByRole('link', { name: '17mm' }).closest('li'));
    fireEvent.click(zoom);
    expect(screen.getAllByText('Digital zoom').length).toBeGreaterThan(0);
  });

  it.each([undefined, 0, 1, -2, NaN, Infinity])(
    'hides inactive or invalid digital zoom %s', ratio => {
      render(<AppStateContext value={{}}>
        <PhotoComponent photo={parsePhotoFromDb({
          ...basePhoto, focalLength: 17, digitalZoomRatio: ratio,
        })} prefetchRelatedLinks={false} />
      </AppStateContext>);
      expect(screen.queryByText(/×/)).toBeNull();
    },
  );
});
