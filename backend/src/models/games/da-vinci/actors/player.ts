import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  // TODO: react to user reconnect

  readonly user: User;
  readonly id: number = Actor.getId();
  readonly name: string;
  private unsortedHand: Array<GamePiece> = [];

  private handEmitter = new BehaviorSubject(this.privateHand);

  private sentMessages: Array<string> = [];
  private lastEmittedPublicHand: Array<{
    userName: string;
    hand: Array<GamePiece>;
  }> = [];

  get lifes(): Number {
    return this.unsortedHand.filter(piece => GamePiece.isPrivate(piece)).length;
  }

  private get privateHand(): Array<GamePiece> {
    return this.unsortedHand.sort((a, b) => GamePiece.compare(a, b));
  }

  private get privateHand$(): Observable<Array<GamePiece>> {
    return this.handEmitter.asObservable();
  }

  private get gameSetup() {
    return {
      colors: this.service.COLORS,
      piecePerColor: this.service.PIECE_PER_COLOR,
    };
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

  async init(): Promise<void> {
    this.service.infoMessage$.subscribe(message => {
      this.sentMessages.push(message);
      this.socket.emit('message-info', message);
    });

    this.service.publicHands$.subscribe(update => {
      this.lastEmittedPublicHand = update;
      this.socket.emit('public-hand-update', update);
    });

    this.privateHand$.subscribe(update =>
      this.socket.emit('private-hand-update', update)
    );

    this.user.reconnected$.subscribe(() => this.handleReconnect());

    return new SocketEventListener<void>(
      this.user,
      'user-connected',
      true,
      false
    )
      .toPromise()
      .then(() => {
        console.log(this.name + ' has connected');
        this.socket.emit('game-init', this.gameSetup);
      });
  }

  makeAGuess(): Promise<Guess> {
    const result = new SocketEventListener<Guess>(
      this.user,
      'guess',
      true,
      true
    ).toPromise();
    this.socket.emit('guess');

    return result.then(guess => Guess.fromDto(guess));
  }

  chooseAColorToTake(state: PieceState): Promise<PieceColor> {
    const result = new SocketEventListener<PieceColor>(
      this.user,
      'pick-color',
      true,
      true,
      state
    ).toPromise();
    this.socket.emit('pick-color', state);

    return result;
  }
  takeExtraAction(): Promise<PieceColor | Guess> {
    const result = new SocketEventListener<PieceColor | Guess>(
      this.user,
      'take-extra-action',
      true,
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
      this.user,
      'game-over',
      true,
      true
    ).toPromise();
    this.socket.emit('game-over');

    // TODO: clean subscriptions

    return result;
  }

  gameStart(): Promise<void> {
    const result = new SocketEventListener<void>(
      this.user,
      'game-start',
      true,
      true
    ).toPromise();
    this.socket.emit('game-start');

    return result;
  }

  private async handleReconnect(): Promise<void> {
    this.socket.once('user-connected', () => {
      console.log('handling-reconnection');
      this.socket.emit('game-init', this.gameSetup);
      this.socket.emit('public-hand-update', this.lastEmittedPublicHand);
      this.socket.emit('private-hand-update', this.privateHand);
      this.sentMessages.forEach(message =>
        this.socket.emit('message-info', message)
      );
    });
  }
}
