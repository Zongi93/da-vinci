import { InvalidPlayError } from './errors';
import { GamePiece, PieceColor, PieceState } from './game-piece';

describe('Game piece', () => {
  describe('state', () => {
    let piecePrivate: GamePiece;
    let piecePublic: GamePiece;
    let pieceMissing: GamePiece;
    beforeEach(() => {
      piecePrivate = new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE);
      piecePublic = new GamePiece(8, PieceColor.BLACK, PieceState.PUBLIC);
      pieceMissing = new GamePiece(1, PieceColor.BLACK);
    });

    it('should be what is initially set', () => {
      expect(piecePrivate.state).toBe(PieceState.PRIVATE);
      expect(piecePublic.state).toBe(PieceState.PUBLIC);
    });

    it('should be MISSING if not set', () => {
      expect(pieceMissing.state).toBe(PieceState.MISSING);
    });

    it('should be able to be changed to PUBLIC from ANY', () => {
      expect(() => {
        pieceMissing.state = PieceState.PUBLIC;
        piecePrivate.state = PieceState.PUBLIC;
      }).not.toThrow(InvalidPlayError);

      expect(pieceMissing.state).toBe(PieceState.PUBLIC);
      expect(piecePrivate.state).toBe(PieceState.PUBLIC);
    });

    it('should be able to be changed to PRIVATE from MISSING', () => {
      expect(() => {
        pieceMissing.state = PieceState.PRIVATE;
      }).not.toThrow(InvalidPlayError);
      expect(() => {
        piecePublic.state = PieceState.PRIVATE;
      }).toThrow(InvalidPlayError);

      expect(pieceMissing.state).toBe(PieceState.PRIVATE);
    });

    it('should not be able to be changed to MISSING from ANY', () => {
      expect(() => {
        piecePrivate.state = PieceState.MISSING;
      }).toThrow(InvalidPlayError);
      expect(() => {
        piecePublic.state = PieceState.MISSING;
      }).toThrow(InvalidPlayError);
    });

    it('should not be able to be set to current state', () => {
      expect(() => {
        pieceMissing.state = PieceState.MISSING;
      }).toThrow(InvalidPlayError);
      expect(() => {
        piecePublic.state = PieceState.PUBLIC;
      }).toThrow(InvalidPlayError);
      expect(() => {
        piecePrivate.state = PieceState.PRIVATE;
      }).toThrow(InvalidPlayError);
    });
  });

  describe('ordering', () => {
    let pieceZeroBlack: GamePiece;
    let pieceZeroWhite: GamePiece;
    let pieceOneBlack: GamePiece;
    let pieceOneWhite: GamePiece;
    beforeEach(() => {
      pieceZeroBlack = new GamePiece(0, PieceColor.BLACK);
      pieceZeroWhite = new GamePiece(0, PieceColor.WHITE);
      pieceOneBlack = new GamePiece(8, PieceColor.BLACK);
      pieceOneWhite = new GamePiece(1, PieceColor.BLACK);
    });
    it('should sort by value correctly', () => {
      expect(GamePiece.compare(pieceZeroBlack, pieceOneBlack)).toBe(-1);
      expect(GamePiece.compare(pieceZeroWhite, pieceOneBlack)).toBe(-1);
      expect(GamePiece.compare(pieceZeroBlack, pieceOneWhite)).toBe(-1);
      expect(GamePiece.compare(pieceZeroBlack, pieceOneWhite)).toBe(-1);

      expect(GamePiece.compare(pieceOneBlack, pieceZeroBlack)).toBe(1);
      expect(GamePiece.compare(pieceOneWhite, pieceZeroBlack)).toBe(1);
      expect(GamePiece.compare(pieceOneBlack, pieceZeroWhite)).toBe(1);
      expect(GamePiece.compare(pieceOneBlack, pieceZeroWhite)).toBe(1);
    });

    it('should sort by color correctly', () => {
      expect(GamePiece.compare(pieceZeroBlack, pieceZeroWhite)).toBe(1);
      expect(GamePiece.compare(pieceZeroWhite, pieceZeroBlack)).toBe(-1);

      expect(GamePiece.compare(pieceOneBlack, pieceOneWhite)).toBe(1);
      expect(GamePiece.compare(pieceOneWhite, pieceOneBlack)).toBe(-1);
    });

    it('should result in expected order', () => {
      const toSort = [pieceOneWhite, pieceZeroWhite, pieceZeroBlack, pieceOneBlack];
      const expected = [pieceZeroWhite, pieceZeroBlack, pieceOneWhite, pieceOneBlack];

      expect(toSort.sort(GamePiece.compare)).toStrictEqual(expected);
    });
  });

  describe('hiding', () => {
    it('should hide the value of a piece', () => {
      const piecePrivate = new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE);
      expect(GamePiece.hide(piecePrivate).number).toBe(Number.NaN);
    });

    it('should not change piece color', () => {
      const pieceBlack = new GamePiece(0, PieceColor.BLACK);
      const pieceWhite = new GamePiece(0, PieceColor.WHITE);

      expect(GamePiece.hide(pieceBlack).color).toBe(PieceColor.BLACK);
      expect(GamePiece.hide(pieceWhite).color).toBe(PieceColor.WHITE);
    });
    it('should have same id as original piece', () => {
      const pieceFirst = new GamePiece(0, PieceColor.BLACK);
      const pieceSecond = new GamePiece(0, PieceColor.WHITE);

      expect(GamePiece.hide(pieceFirst).id).toBe(pieceFirst.id);
      expect(GamePiece.hide(pieceSecond).id).toBe(pieceSecond.id);
    });
  });
});
