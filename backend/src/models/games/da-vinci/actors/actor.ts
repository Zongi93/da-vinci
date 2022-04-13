import { Observable } from 'rxjs';
import { GamePiece, Guess, PieceColor } from '../utils';
import { ColorRequestEvent } from '../utils/color-request-event';
import { GameAction } from '../utils/extra-action.enum';

let counter = 0;
export abstract class Actor {
  abstract get lifes(): Number;
  abstract get publicHand$(): Observable<Array<GamePiece>>;
  abstract readonly name: string;
  abstract readonly id: number;

  static getId(): number {
    return counter++;
  }

  abstract init(): Promise<void>;
  abstract checkGuess(guess: Guess): boolean;
  abstract takePiece(piece: GamePiece): void;
  abstract showPiece(position: number): void;
  abstract makeAGuess(): Promise<Guess>;
  abstract chooseAColorToTake(requestInfo: ColorRequestEvent): Promise<PieceColor>;
  abstract chooseExtraAction(availableActions: Array<GameAction>): Promise<GameAction>;
  abstract gameOver(winnerName: string): Promise<void>;
  abstract gameStart(): Promise<void>;
}
