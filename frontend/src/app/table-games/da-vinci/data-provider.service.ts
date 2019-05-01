import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { GameAction, GamePiece, Guess, PieceState } from './root/models';
import { ColorRequestEvent } from './root/models/color-request-info';

@Injectable()
export class DavinciSocketService implements IDavinciSocketService {
  readonly setupInfo: SetupInfo;
  private timer: NodeJS.Timer;

  constructor(private socket: Socket) {}

  get gameSetup$(): Observable<SetupInfo> {
    console.log('gameSetup get');
    this.timer = setInterval(() => {
      console.log('trying to connect');
      this.socket.emit('user-connected');
    }, 1000);

    return this.socket.fromEvent<SetupInfo>('game-init').pipe(
      map(dto => {
        clearInterval(this.timer);
        return SetupInfo.fromDto(dto);
      }),
      tap(data => console.log(data))
    );
  }

  get publicHands$(): Observable<Array<PublicHand>> {
    console.log('publicHands get');
    return this.socket.fromEvent<Array<PublicHand>>('public-hand-update').pipe(
      map(hands => hands.map(hand => PublicHand.fromDto(hand))),
      tap(data => console.log(data))
    );
  }

  get privateHand$(): Observable<Array<GamePiece>> {
    return this.socket.fromEvent<Array<GamePiece>>('private-hand-update').pipe(
      map(hand => hand.map(piece => GamePiece.fromDto(piece))),
      tap(data => console.log(data))
    );
  }

  get infoMessage$(): Observable<string> {
    return this.socket.fromEvent<string>('message-info');
  }

  get makeAGuess$(): Observable<void> {
    return this.socket
      .fromEvent<void>('guess')
      .pipe(tap(data => console.log(data)));
  }

  get chooseAColorToTake$(): Observable<ColorRequestEvent> {
    return this.socket.fromEvent<ColorRequestEvent>('pick-color').pipe(
      map(request => ColorRequestEvent.fromDto(request)),
      delay(1000),
      tap(data => console.log(data))
    );
  }

  get chooseExtraAction$(): Observable<Array<GameAction>> {
    return this.socket
      .fromEvent<Array<GameAction>>('take-extra-action')
      .pipe(tap(data => console.log(data)));
  }

  get gameOver$(): Observable<string> {
    return this.socket
      .fromEvent<string>('game-over')
      .pipe(tap(data => console.log(data)));
  }

  sendSelectedColor(colorId: number): void {
    this.socket.emit('pick-color', colorId);
  }

  sendGuess(guess: Guess): void {
    this.socket.emit('guess', guess);
  }

  sendExtraActionChoice(choice: GameAction) {
    this.socket.emit('take-extra-action', choice);
  }

  acknowledgeGameOver(): void {
    this.socket.emit('game-over');
  }
}

@Injectable()
export abstract class IDavinciSocketService {
  abstract get gameSetup$(): Observable<SetupInfo>;
  abstract get publicHands$(): Observable<Array<PublicHand>>;
  abstract get privateHand$(): Observable<Array<GamePiece>>;
  abstract get infoMessage$(): Observable<string>;
  abstract get makeAGuess$(): Observable<void>;
  abstract get chooseAColorToTake$(): Observable<ColorRequestEvent>;
  abstract get chooseExtraAction$(): Observable<Array<GameAction>>;
  abstract get gameOver$(): Observable<string>;

  abstract sendSelectedColor(colorId: number): void;
  abstract sendGuess(guess: Guess): void;
  abstract sendExtraActionChoice(choice: GameAction);
  abstract acknowledgeGameOver(): void;
}

export class PublicHand {
  private readonly _hand: Array<GamePiece>;

  get hand(): Array<GamePiece> {
    return this._hand;
  }

  constructor(public readonly userName: string, hand: Array<GamePiece>) {
    this._hand = hand;
  }

  static fromDto(dto: PublicHand): PublicHand {
    console.log(dto);
    const hand = dto.hand.map(piece => GamePiece.fromDto(piece));
    return new PublicHand(dto.userName, hand);
  }
}

export class SetupInfo {
  private readonly _players: Array<string>;

  get players(): Array<string> {
    return this._players;
  }

  constructor(
    public readonly colors: number,
    public readonly piecePerColor: number,
    players: Array<string>
  ) {
    this._players = players;
  }

  static fromDto(dto: SetupInfo) {
    return new SetupInfo(dto.colors, dto.piecePerColor, dto.players);
  }
}
