import { getUploadProgress } from '@/admin/upload';

describe('getUploadProgress', () => {
  it('weights progress by file size', () => {
    expect(getUploadProgress([100, 300], 0, 50)).toBe(0.125);
    expect(getUploadProgress([100, 300], 1, 150)).toBe(0.625);
    expect(getUploadProgress([100, 300], 1, 300)).toBe(1);
  });
  it('returns 0 when total size is 0', () => {
    expect(getUploadProgress([], 0, 0)).toBe(0);
    expect(getUploadProgress([0], 0, 0)).toBe(0);
  });
});
