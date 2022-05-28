import { GameDaVinci } from '../service';
import { GamePiece, Guess, Hand, PieceColor, PieceState } from '../utils';
import { Logic } from './computer-opponent';

const OPPONENT_NAME = 'opponent';

describe("Computer opponent logic's", () => {
  let serviceMock: GameDaVinci;
  let aiHand: Array<GamePiece>;
  let opponentHands: Array<Hand>;
  let logic: Logic;

  describe('best guess', () => {
    it('should be correct if last piece has only a single option', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 1 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(0, PieceColor.BLACK, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.guess).toStrictEqual(new Guess(OPPONENT_NAME, 0, 0));
      expect(bestGuess.certanty).toEqual(1);
    });

    it('should be 100% certain when all pieces from a color are in play 1', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 2 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.guess).toStrictEqual(new Guess(OPPONENT_NAME, 0, 1));
      expect(bestGuess.certanty).toEqual(1);
    });

    it('should be 100% certain when all pieces from a color are in play 2', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 3 } as unknown as GameDaVinci;
      aiHand = [
        new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE),
        new GamePiece(0, PieceColor.BLACK, PieceState.PRIVATE),
        new GamePiece(2, PieceColor.WHITE, PieceState.PRIVATE),
      ];
      opponentHands = hideHand([
        new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE),
        new GamePiece(1, PieceColor.BLACK, PieceState.PRIVATE),
        new GamePiece(2, PieceColor.BLACK, PieceState.PRIVATE),
      ]);

      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.certanty).toEqual(1);
    });

    it('should not be 100% certain when best guess has multiple options', () => {
      serviceMock = { COLORS: 1, PIECE_PER_COLOR: 3 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE)]);

      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.certanty).not.toEqual(1);
    });
  });

  describe('desired color', () => {
    it('should be an available color 1', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 2 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      expect(logic.getbestColor([PieceColor.BLACK])).toBe(PieceColor.BLACK);
    });

    it('should be an available color 2', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 2 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(1, PieceColor.BLACK, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.BLACK, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      expect(logic.getbestColor([PieceColor.WHITE])).toBe(PieceColor.WHITE);
    });
  });

  describe('certantyThreshold', () => {
    it('should always will to take 100% certain guesses 1', () => {
      serviceMock = { COLORS: 1, PIECE_PER_COLOR: 2 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.certanty).toEqual(1);
      expect(logic.certantyThreshold <= bestGuess.certanty).toBe(true);
    });

    it('should always will to take 100% certain guesses 2', () => {
      serviceMock = { COLORS: 2, PIECE_PER_COLOR: 1 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(0, PieceColor.BLACK, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(bestGuess.certanty).toEqual(1);
      expect(logic.certantyThreshold <= bestGuess.certanty).toBe(true);
    });

    it('should require a better guess when best guess has 100 options.', () => {
      serviceMock = { COLORS: 1, PIECE_PER_COLOR: 100 } as unknown as GameDaVinci;
      aiHand = [new GamePiece(1, PieceColor.WHITE, PieceState.PRIVATE)];
      opponentHands = hideHand([new GamePiece(0, PieceColor.WHITE, PieceState.PRIVATE)]);
      logic = new Logic(serviceMock, opponentHands, aiHand);

      const bestGuess = logic.bestGuess;
      expect(logic.certantyThreshold > bestGuess.certanty).toBe(true);
    });
  });
});

function hideHand(hand: Array<GamePiece>): Array<Hand> {
  return [new Hand(OPPONENT_NAME, hand.map(GamePiece.hide))];
}
