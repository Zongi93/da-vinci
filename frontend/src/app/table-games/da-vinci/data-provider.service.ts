import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GamePiece } from './root/models';

@Injectable()
export class DavinciSocketService implements IDavinciSocketService {
  constructor(private socket: Socket) {}
  get publicHands$(): Observable<Array<PublicHand>> {
    return this.socket
      .fromEvent<Array<PublicHand>>('public-hand-update')
      .pipe(map(hands => hands.map(hand => PublicHand.fromDto(hand))));
  }

  get privateHand$(): Observable<Array<GamePiece>> {
    return this.socket
      .fromEvent<Array<GamePiece>>('private-hand-update')
      .pipe(map(hand => hand.map(piece => GamePiece.fromDto(piece))));
  }

  get infoMessage$(): Observable<string> {
    return this.socket.fromEvent<string>('message-info');
  }

  get makeAGuess$(): Observable<void> {
    return this.socket.fromEvent<void>('guess');
  }

  get chooseAColorToTake$(): Observable<void> {
    return this.socket.fromEvent<void>('pick-color');
  }

  get takeExtraAction$(): Observable<void> {
    return this.socket.fromEvent<void>('take-extra-action');
  }

  get gameOver$(): Observable<void> {
    return this.socket.fromEvent<void>('game-over');
  }
}

@Injectable()
export abstract class IDavinciSocketService {
  abstract get publicHands$(): Observable<Array<PublicHand>>;
  abstract get privateHand$(): Observable<Array<GamePiece>>;
  abstract get infoMessage$(): Observable<string>;
  abstract get makeAGuess$(): Observable<void>;
  abstract get chooseAColorToTake$(): Observable<void>;
  abstract get takeExtraAction$(): Observable<void>;
  abstract get gameOver$(): Observable<void>;
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
