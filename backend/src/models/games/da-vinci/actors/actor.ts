import { Observable } from 'rxjs';
import { GamePiece, Guess, PieceColor, PieceState } from '../utils';

let counter = 0;
export abstract class Actor {
  abstract get lifes(): Number;
  abstract get publicHand$(): Observable<Array<GamePiece>>;
  abstract readonly name: string;
  abstract readonly id: number;

  static getId(): number {
    return counter++;
  }

  abstract init(): void;
  abstract checkGuess(guess: Guess): boolean;
  abstract takePiece(piece: GamePiece): void;
  abstract showPiece(position: number): void;
  abstract async makeAGuess(): Promise<Guess>;
  abstract async chooseAColorToTake(state: PieceState): Promise<PieceColor>;
  abstract async takeExtraAction(): Promise<Guess | PieceColor>;
  abstract async gameOver(): Promise<void>;
}
