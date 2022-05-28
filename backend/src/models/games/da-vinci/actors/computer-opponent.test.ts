import { take } from 'rxjs/operators';
import { GameDaVinci } from '../service';
import { GamePiece, Guess, PieceColor, PieceState } from '../utils';
import { ComputerOpponent } from './computer-opponent';

const NAME = 'test';

describe("Computer Opponent's", () => {
  const serviceMock = { COLORS: 2, PIECE_PER_COLOR: 5 } as unknown as GameDaVinci;
  const initialHand = [
    new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE),
    new GamePiece(0, PieceColor.BLACK, PieceState.PUBLIC),
    new GamePiece(2, PieceColor.WHITE, PieceState.PRIVATE),
  ];
  let computerOpponent: ComputerOpponent;

  beforeEach(() => {
    computerOpponent = new ComputerOpponent(serviceMock, NAME);
    initialHand.forEach(({ number, color, state }) => computerOpponent.takePiece(new GamePiece(number, color, state)));
  });

  describe('lifes function', () => {
    it('should return the correct value for the initial hand', () => {
      expect(computerOpponent.lifes).toBe(2);
    });

    it('should increase if a private piece is drawn', () => {
      computerOpponent.takePiece(new GamePiece(4, PieceColor.BLACK, PieceState.PRIVATE));
      expect(computerOpponent.lifes).toBe(3);
    });

    it('should decrease if a private piece is revealed', () => {
      computerOpponent.showPiece(0);
      expect(computerOpponent.lifes).toBe(1);
    });
  });

  describe('checkGuess function', () => {
    it('should return true if the guess is correct', () => {
      expect(computerOpponent.checkGuess(new Guess(NAME, 0, 0))).toBe(true);
    });

    it('should return false if the guess is incorrect', () => {
      expect(computerOpponent.checkGuess(new Guess(NAME, 2, 1))).toBe(false);
    });
  });

  describe('publicHand$ observable', () => {
    it('should hide the value for PRIVATE pieces but show for PUBLIC ones', async () => {
      const publicHand = await computerOpponent.publicHand$.pipe(take(1)).toPromise();

      const expectedHand = [
        new GamePiece(Number.NaN, PieceColor.WHITE, PieceState.PRIVATE),
        new GamePiece(0, PieceColor.BLACK, PieceState.PUBLIC),
        new GamePiece(Number.NaN, PieceColor.WHITE, PieceState.PRIVATE),
      ];
      expect(publicHand).toStrictEqual(expectedHand);
    });

    it('should show new piece inserted into hand', async () => {
      const publicHandOriginal = await computerOpponent.publicHand$.pipe(take(1)).toPromise();
      const newPiece = new GamePiece(3, PieceColor.BLACK, PieceState.PRIVATE, -1);
      computerOpponent.takePiece(newPiece);
      const publicHandModified = await computerOpponent.publicHand$.pipe(take(1)).toPromise();

      expect(publicHandModified.length - 1).toBe(publicHandOriginal.length);
      expect(!!publicHandModified.find((piece) => piece.id === newPiece.id)).toBe(true);
    });

    it('should show private piece as public after it is revealed in hand', async () => {
      const publicHandOriginal = await computerOpponent.publicHand$.pipe(take(1)).toPromise();
      computerOpponent.showPiece(2);
      const publicHandModified = await computerOpponent.publicHand$.pipe(take(1)).toPromise();

      expect(publicHandOriginal[2].state).toBe(PieceState.PRIVATE);
      expect(publicHandOriginal[2].number).toBe(Number.NaN);
      expect(publicHandModified[2].state).toBe(PieceState.PUBLIC);
      expect(publicHandModified[2].number).toBe(2);
    });
  });
});
