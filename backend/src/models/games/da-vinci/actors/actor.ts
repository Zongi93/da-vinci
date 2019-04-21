import { Observable } from 'rxjs';
import { GamePiece, Guess, PieceColor, PieceState } from '../utils';
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

  abstract async init(): Promise<void>;
  abstract checkGuess(guess: Guess): boolean;
  abstract takePiece(piece: GamePiece): void;
  abstract showPiece(position: number): void;
  abstract async makeAGuess(): Promise<Guess>;
  abstract async chooseAColorToTake(
    requestInfo: ColorRequestEvent
  ): Promise<PieceColor>;
  abstract async chooseExtraAction(
    availableActions: Array<GameAction>
  ): Promise<GameAction>;
  abstract async gameOver(winnerName: string): Promise<void>;
  abstract async gameStart(): Promise<void>;
}
