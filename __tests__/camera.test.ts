import { Camera, formatCameraText } from '@/camera';

describe('Camera', () => {
  it('labels correctly', () => {
    const apple: Camera = { make: 'Apple', model: 'iPhone 11 Pro' };
    expect(formatCameraText(apple, true)).toBe('Apple iPhone 11 Pro');
    expect(formatCameraText(apple, false)).toBe('iPhone 11 Pro');
    const fujifilm: Camera = { make: 'Fujifilm', model: 'X-T5' };
    expect(formatCameraText(fujifilm)).toBe('Fujifilm X-T5');
    const canon: Camera = { make: 'Canon', model: 'Canon EOS 800D' };
    expect(formatCameraText(canon)).toBe('Canon EOS 800D');
  });
});

