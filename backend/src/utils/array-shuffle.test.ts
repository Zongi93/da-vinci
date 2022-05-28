require('./array-shuffle');

describe('Array shuffle', () => {
  describe('with strings', () => {
    const stringArray = ['aaa', 'bbb', 'ccc', 'ddd'];
    it('should return the same elements in any order', () => {
      const shuffled = stringArray.shuffle();

      expect(shuffled.length).toEqual(stringArray.length);
      stringArray.forEach((string) => expect(shuffled).toContain(string));
    });
  });
  describe('with numbers', () => {
    const numberArray = [0, 1, 2, 3];
    it('should return the same elements in any order', () => {
      const shuffled = numberArray.shuffle();

      expect(shuffled.length).toEqual(numberArray.length);
      numberArray.forEach((number) => expect(shuffled).toContain(number));
    });
  });
  describe('with objects', () => {
    const objectArray = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    it('should return the same elements in any order', () => {
      const shuffled = objectArray.shuffle();

      expect(shuffled.length).toEqual(objectArray.length);
      objectArray.forEach((object) => expect(shuffled).toContain(object));
    });
  });
});
