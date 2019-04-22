import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
import { ColorRequestEvent } from '../utils/color-request-event';
import { GameAction } from '../utils/extra-action.enum';
import { Actor } from './actor';

export class Player implements Actor {
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
  private inProgressRequest: SocketEventListener<any> = undefined;

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

  private readonly SUBSCRIPTIONS: Array<Subscription> = []; // event subscriptions

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
    this.SUBSCRIPTIONS.push(
      this.service.infoMessage$.subscribe(message => {
        this.sentMessages.push(message);
        this.socket.emit('message-info', message);
      })
    );

    this.SUBSCRIPTIONS.push(
      this.service.publicHands$.subscribe(update => {
        this.lastEmittedPublicHand = update;
        this.socket.emit('public-hand-update', update);
      })
    );

    this.SUBSCRIPTIONS.push(
      this.privateHand$.subscribe(update =>
        this.socket.emit('private-hand-update', update)
      )
    );

    this.SUBSCRIPTIONS.push(
      this.user.reconnected$.subscribe(() => this.handleReconnect())
    );
    console.log('listening for user connected');
    return this.eventToPromise<void>('user-connected', false).finally(() => {
      console.log(this.name + ' has connected');
      this.socket.emit('game-init', this.gameSetup);
    });
  }

  makeAGuess(): Promise<Guess> {
    return this.eventToPromise<Guess>('guess', true).then(guess =>
      Guess.fromDto(guess)
    );
  }

  chooseAColorToTake(requestInfo: ColorRequestEvent): Promise<PieceColor> {
    return this.eventToPromise<PieceColor>('pick-color', true, requestInfo);
  }

  chooseExtraAction(availableActions: Array<GameAction>): Promise<GameAction> {
    return this.eventToPromise<GameAction>(
      'take-extra-action',
      true,
      availableActions
    );
  }

  gameOver(winnerName: string): Promise<void> {
    return this.eventToPromise<void>('game-over', true, winnerName).finally(
      () => this.cleanUp()
    );
  }

  gameStart(): Promise<void> {
    return this.eventToPromise<void>('game-start', true);
  }

  private async handleReconnect(): Promise<void> {
    this.socket.once('user-connected', () => {
      this.socket.emit('game-init', this.gameSetup);
      this.socket.emit('public-hand-update', this.lastEmittedPublicHand);
      this.socket.emit('private-hand-update', this.privateHand);
      this.sentMessages.forEach(message =>
        this.socket.emit('message-info', message)
      );

      if (!!this.inProgressRequest) {
        this.inProgressRequest.start();
      }
    });
  }

  private eventToPromise<T>(
    key: string,
    sendPayload?: boolean,
    payload?: any
  ): Promise<T> {
    this.inProgressRequest = new SocketEventListener<T>(
      this.user,
      key,
      true,
      sendPayload,
      payload
    );

    return this.inProgressRequest.toPromise().finally(() => {
      this.inProgressRequest.unsubscribe();
      this.inProgressRequest = undefined;
    });
  }

  private cleanUp(): void {
    this.SUBSCRIPTIONS.forEach(subscription => subscription.unsubscribe());
    this.socket.removeAllListeners('message-info');
    this.socket.removeAllListeners('public-hand-update');
    this.socket.removeAllListeners('private-hand-update');
    this.socket.removeAllListeners('user-connected');
    this.socket.removeAllListeners('game-init');
    this.socket.removeAllListeners('guess');
    this.socket.removeAllListeners('pick-color');
    this.socket.removeAllListeners('game-over');
    this.socket.removeAllListeners('game-start');
  }
}
