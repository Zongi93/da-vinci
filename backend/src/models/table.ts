import { Observable } from 'rxjs';
import { TableGame, TableGameInfo } from './games/_table-game';
import { User, UserDto } from './user';

let counter = 0;

export class Table {
  readonly id = counter++;
  private _players: Array<User>;
  private game: TableGame = undefined;
  private gameTitleForUI: string = undefined;

  get deleteMe$(): Observable<void> {
    return this.game.deleteMe$;
  }

  get players(): Array<User> {
    return this._players;
  }

  constructor(user: User) {
    this._players = Array.of(user);
  }

  addPlayer(user: User) {
    if (!this.game) {
      this.players.push(user);
    }
  }

  removePlayer(user: User) {
    if (!this.game) {
      this._players = this.players.filter(player => player.id !== user.id);
    }
  }

  start(gameTitle: string) {
    const gameToStart = TableGameInfo.list.find(
      gameInfo => gameInfo.gameTitle === gameTitle
    );
    if (
      !!gameToStart &&
      !this.game &&
      gameToStart.canGameStart(this.players.length)
    ) {
      switch (gameTitle) {
        case 'Da Vinci':
          this.game = gameToStart.ctor.apply(undefined, [this.players, 0]);
          break;
      }
    }

    this.gameTitleForUI = gameTitle;
  }

  getHash(): number {
    return this.id;
  }

  toDto(): TableDto {
    // const gameTitle = !!this.game ? this.game.gameInfo.gameTitle : undefined;
    return {
      id: this.id,
      players: this.players.map(player => player.toDto()),
      token: this.getHash(),
      gameTitle: this.gameTitleForUI,
      canJoin: !this.game,
    };
  }
}

export interface TableDto {
  readonly id: number;
  readonly players: Array<UserDto>;
  readonly token: number;
  readonly gameTitle: string;
  readonly canJoin: boolean;
}
