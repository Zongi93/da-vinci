import { Observable } from 'rxjs';

export abstract class TableGame {
  static readonly MIN_PLAYER: Number;
  static readonly MAX_PLAYER: Number;
  static readonly AI_SUPPORTED: boolean;

  static canGameStart(players: number): boolean {
    return TableGame.MIN_PLAYER <= players && TableGame.MAX_PLAYER >= players;
  }

  abstract get deleteMe$(): Observable<void>;
}
