import { Observable } from 'rxjs';
import { GameDaVinci } from '../service';
import { GamePiece, Guess, PieceColor, PieceState } from '../utils';
import { Actor } from './actor';

export class ComputerOpponent implements Actor {
  readonly name: string;
  readonly id: number = Actor.getId();

  get lifes(): Number {
    return 1;
  }

  get publicHand$(): Observable<GamePiece[]> {
    return undefined;
  }
  constructor(private service: GameDaVinci, name: string) {
    this.name = name;
  }

  init(): void {}

  takePiece(piece: GamePiece): void {
    throw new Error('Method not implemented.');
  }

  checkGuess(guess: Guess): boolean {
    throw new Error('Method not implemented.');
  }
  showPiece(position: number): void {
    throw new Error('Method not implemented.');
  }

  makeAGuess(): Promise<Guess> {
    throw new Error('Method not implemented.');
  }
  chooseAColorToTake(state: PieceState): Promise<PieceColor> {
    throw new Error('Method not implemented.');
  }
  takeExtraAction(): Promise<PieceColor | Guess> {
    throw new Error('Method not implemented.');
  }
  gameOver(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  gameStart(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
