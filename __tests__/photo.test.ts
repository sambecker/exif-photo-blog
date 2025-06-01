import { descriptionForPhoto, Photo } from '@/photo';

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
