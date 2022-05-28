import { TableGameInfo } from './_table-game';

describe('TableGameInfo', () => {
  describe('canGameStart function', () => {
    const testGameInfo1 = new TableGameInfo('test1', 0, 2, false, undefined);
    const testGameInfo2 = new TableGameInfo('test2', 2, 5, false, undefined);
    it('should return true if number of players is exactly the minimum player number.', () => {
      expect(testGameInfo1.canGameStart(0)).toBe(true);
      expect(testGameInfo2.canGameStart(2)).toBe(true);
    });

    it('should return true if number of players is exactly the maximum player number.', () => {
      expect(testGameInfo1.canGameStart(2)).toBe(true);
      expect(testGameInfo2.canGameStart(5)).toBe(true);
    });

    it('should return true if number of players is between the minimum and maximum player number.', () => {
      expect(testGameInfo1.canGameStart(1)).toBe(true);
      expect(testGameInfo2.canGameStart(4)).toBe(true);
    });

    it('should return false if number of players is lower then the minimum player number.', () => {
      expect(testGameInfo1.canGameStart(-1)).toBe(false);
      expect(testGameInfo2.canGameStart(1)).toBe(false);
    });

    it('should return false if number of players is higher then the maximum player number.', () => {
      expect(testGameInfo1.canGameStart(3)).toBe(false);
      expect(testGameInfo2.canGameStart(6)).toBe(false);
    });
  });
});
