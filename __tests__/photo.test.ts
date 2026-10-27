import { descriptionForPhoto, Photo } from '@/photo';
import { getTakenAtOffsetMsForForm } from '@/photo/form';

const PHOTO: Partial<Photo> = {
  takenAt: new Date('2025-01-01 12:00:00'),
};

const PHOTO_SEMANTIC: Partial<Photo> = {
  ...PHOTO,
  semanticDescription: 'Semantic Description',
};

const PHOTO_CAPTION: Partial<Photo> = {
  ...PHOTO_SEMANTIC,
  caption: 'Caption',
};

describe('Should generate photo description', () => {
  it('with caption', () => {
    expect(descriptionForPhoto(PHOTO_CAPTION as Photo))
      .toBe('Caption');
  });
  it('with semantic description (disabled)', () => {
    expect(descriptionForPhoto(PHOTO_SEMANTIC as Photo))
      .toBe('01 JAN 2025 12:00PM');
  });
  it('with semantic description (enabled)', () => {
    expect(descriptionForPhoto(PHOTO_SEMANTIC as Photo, true))
      .toBe('Semantic Description');
  });
  it('with date', () => {
    expect(descriptionForPhoto(PHOTO as Photo))
      .toBe('01 JAN 2025 12:00PM');
  });
});

describe('Should track taken-at offset in form', () => {
  const HOUR = 60 * 60 * 1000;
  it('from consistent fields', () => {
    expect(getTakenAtOffsetMsForForm({
      takenAt: '2024-01-07T21:30:50.000Z',
      takenAtNaive: '2024-01-07 15:30:50',
    }, 2 * HOUR)).toBe(-6 * HOUR);
  });
  it('keeping previous offset while partially typed', () => {
    expect(getTakenAtOffsetMsForForm({
      takenAt: '2024-01-07T21:3',
      takenAtNaive: '2024-01-07 15:30:50',
    }, -6 * HOUR)).toBe(-6 * HOUR);
  });
  it('dropping offset when fields are inconsistent', () => {
    expect(getTakenAtOffsetMsForForm({
      takenAt: '2026-10-20T20:20:09.384Z',
      takenAtNaive: '2026-10-10 20:09:09',
    }, -6 * HOUR)).toBeUndefined();
  });
});
