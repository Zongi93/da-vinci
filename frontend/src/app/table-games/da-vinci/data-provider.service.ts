import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GamePiece, PieceState } from './root/models';

@Injectable()
export class DavinciSocketService implements IDavinciSocketService {
  readonly setupInfo: SetupInfo;
  private timer: NodeJS.Timer;

  constructor(private socket: Socket) {}

  get gameSetup$(): Observable<SetupInfo> {
    this.timer = setInterval(() => {
      console.log('trying to connect');
      this.socket.emit('user-connected');
    }, 1000);

    return this.socket.fromEvent<SetupInfo>('game-init').pipe(
      map(dto => {
        clearInterval(this.timer);
        return SetupInfo.fromDto(dto);
      })
    );
  }

  get publicHands$(): Observable<Array<PublicHand>> {
    return this.socket.fromEvent<Array<PublicHand>>('public-hand-update').pipe(
      map(hands => hands.map(hand => PublicHand.fromDto(hand))),
      tap(data => console.log({ 'public hands': data }))
    );
  }

  get privateHand$(): Observable<Array<GamePiece>> {
    return this.socket.fromEvent<Array<GamePiece>>('private-hand-update').pipe(
      map(hand => hand.map(piece => GamePiece.fromDto(piece))),
      tap(data => console.log({ 'private hand': data }))
    );
  }

  get infoMessage$(): Observable<string> {
    return this.socket.fromEvent<string>('message-info');
  }

  get makeAGuess$(): Observable<void> {
    return this.socket.fromEvent<void>('guess');
  }

  get chooseAColorToTake$(): Observable<PieceState> {
    return this.socket.fromEvent<PieceState>('pick-color');
  }

  get takeExtraAction$(): Observable<void> {
    return this.socket.fromEvent<void>('take-extra-action');
  }

  get gameOver$(): Observable<void> {
    return this.socket.fromEvent<void>('game-over');
  }

  sendSelectedColor(colorId: number): void {
    this.socket.emit('pick-color', colorId);
  }
}

@Injectable()
export abstract class IDavinciSocketService {
  abstract get gameSetup$(): Observable<SetupInfo>;
  abstract get publicHands$(): Observable<Array<PublicHand>>;
  abstract get privateHand$(): Observable<Array<GamePiece>>;
  abstract get infoMessage$(): Observable<string>;
  abstract get makeAGuess$(): Observable<void>;
  abstract get chooseAColorToTake$(): Observable<PieceState>;
  abstract get takeExtraAction$(): Observable<void>;
  abstract get gameOver$(): Observable<void>;

  abstract sendSelectedColor(colorId: number): void;
}

export class PublicHand {
  readonly userName: string;
  readonly hand: Array<GamePiece>;

  constructor(userName: string, hand: Array<GamePiece>) {
    this.userName = userName;
    this.hand = hand;
  }

  static fromDto(dto: PublicHand): PublicHand {
    const hand = dto.hand.map(piece => GamePiece.fromDto(piece));
    return new PublicHand(dto.userName, hand);
  }
}

export class SetupInfo {
  readonly colors: number;
  readonly piecePerColor: number;

  constructor(colors: number, piecePerColor: number) {
    this.colors = Number(colors);
    this.piecePerColor = Number(piecePerColor);
  }

  static fromDto(dto: SetupInfo) {
    return new SetupInfo(dto.colors, dto.piecePerColor);
  }
}
