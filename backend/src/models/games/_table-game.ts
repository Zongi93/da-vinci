import { Observable } from 'rxjs';
import { GameDaVinci } from './da-vinci/service';

export abstract class TableGame {
  static readonly INFO: TableGameInfo;

  abstract get gameInfo(): TableGameInfo;
  abstract async startGame(): Promise<void>;
}

export class TableGameInfo {
  readonly gameTitle: string;
  readonly minPlayer: number;
  readonly maxPlayer: number;
  readonly aiSupported: boolean;
  readonly ctor: ([...any]) => TableGame;

  static get list(): Array<TableGameInfo> {
    return [GameDaVinci.INFO];
  }

  constructor(
    gameTitle: string,
    minPlayer: number,
    maxPlayer: number,
    aiSuppoerted: boolean,
    ctor: ([...any]) => TableGame
  ) {
    this.gameTitle = gameTitle;
    this.minPlayer = minPlayer;
    this.maxPlayer = maxPlayer;
    this.aiSupported = aiSuppoerted;
    this.ctor = ctor;
  }

  canGameStart(players: number): boolean {
    return this.minPlayer <= players && this.maxPlayer >= players;
  }
}
