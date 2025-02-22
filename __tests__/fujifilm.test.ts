import { processTone } from '@/platforms/fujifilm/recipe';

describe('Fujifilm', () => {
  describe('recipes', () => {
    it('process tone', () => {
      expect(processTone(0)).toBe(0);
      expect(processTone(8)).toBe(-0.5);
      expect(processTone(16)).toBe(-1);
      expect(processTone(32)).toBe(-2);
      expect(processTone(-16)).toBe(1);
      expect(processTone(-32)).toBe(2);
      expect(processTone(-48)).toBe(3);
      expect(processTone(-64)).toBe(4);
    });
  });
});
