import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { User } from '../../..';
import { GameDaVinci } from '../service';
import {
  GamePiece,
  Guess,
  PieceColor,
  PieceState,
  SocketEventListener
} from '../utils';
import { Actor } from './actor';

export class Player implements Actor {
  readonly user: User;
  readonly id: number = Actor.getId();
  readonly name: string;
  private unsortedHand: Array<GamePiece> = [];

  private handEmitter = new BehaviorSubject(this.privateHand);

  get lifes(): Number {
    return this.unsortedHand.filter(piece => GamePiece.isPrivate(piece)).length;
  }

  private get privateHand(): Array<GamePiece> {
    return this.unsortedHand.sort((a, b) => GamePiece.compare(a, b));
  }

  private get privateHand$(): Observable<Array<GamePiece>> {
    return this.handEmitter.asObservable();
  }

  get publicHand$(): Observable<Array<GamePiece>> {
    return this.privateHand$.pipe(
      map(hand =>
        hand.map(piece =>
          GamePiece.isPrivate(piece) ? GamePiece.hide(piece) : piece
        )
      )
    );
  }

  get socket(): Socket {
    return this.user.socket;
  }

  constructor(private service: GameDaVinci, user: User) {
    this.user = user;
    this.name = user.userName;
  }

  checkGuess(guess: Guess): boolean {
    return this.privateHand[guess.position].number === guess.value;
  }

  takePiece(piece: GamePiece) {
    this.unsortedHand.push(piece);
    this.handEmitter.next(this.privateHand);
  }

  showPiece(position: number): void {
    this.privateHand[position].state = PieceState.PUBLIC;
    this.handEmitter.next(this.privateHand);
  }

  init(): void {
    this.service.infoMessage$.subscribe(message =>
      this.socket.emit('message-info', message)
    );
    this.service.publicHands$.subscribe(update =>
      this.socket.emit('public-hand-update', update)
    );
    this.privateHand$.subscribe(update =>
      this.socket.emit('private-hand-update', update)
    );
  }

  makeAGuess(): Promise<Guess> {
    const result = new SocketEventListener<Guess>(
      this.socket,
      'guess',
      true
    ).toPromise();
    this.socket.emit('guess');

    return result.then(guess => Guess.fromDto(guess));
  }
  chooseAColorToTake(state: PieceState): Promise<PieceColor> {
    const result = new SocketEventListener<PieceColor>(
      this.socket,
      'pick-color',
      true
    ).toPromise();
    this.socket.emit('pick-color', state);

    return result;
  }
  takeExtraAction(): Promise<PieceColor | Guess> {
    const result = new SocketEventListener<PieceColor | Guess>(
      this.socket,
      'take-extra-action',
      true
    ).toPromise();
    this.socket.emit('take-extra-action');

    return result.then(response =>
      Object.keys(response).length > 0
        ? Guess.fromDto(response as Guess)
        : response
    );
  }

  gameOver(): Promise<void> {
    const result = new SocketEventListener<void>(
      this.socket,
      'game-over',
      true
    ).toPromise();
    this.socket.emit('game-over');

    return result;
  }

  gameStart(): Promise<void> {
    const result = new SocketEventListener<void>(
      this.socket,
      'game-start',
      true
    ).toPromise();
    this.socket.emit('game-start');

    return result;
  }
}
