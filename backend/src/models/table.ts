import { Observable } from 'rxjs';
import { TableGame } from './games/_table-game';
import { GameDaVinci } from './games/da-vinci/service';
import { User, UserDto } from './user';

let counter = 0;

export class Table {
  readonly id = counter++;
  private players: Array<User>;
  private game: TableGame = undefined;

  get deleteMe$(): Observable<void> {
    return this.game.deleteMe$;
  }

  constructor(user: User) {
    this.players = Array.of(user);
  }

  addPlayer(user: User) {
    if (!this.game) {
      this.players.push(user);
    }
  }

  removePlayer(user: User) {
    if (!this.game) {
      this.players = this.players.filter(player => player.id !== user.id);
    }
  }

  start() {
    if (GameDaVinci.canGameStart(this.players.length) && !this.game) {
      this.game = new GameDaVinci(this.players);
    }
  }

  getHash(): number {
    return this.id;
  }

  toDto(): TableDto {
    return {
      players: this.players.map(player => player.toDto()),
      token: this.getHash(),
      canJoin: !this.game,
    };
  }
}

export interface TableDto {
  readonly players: Array<UserDto>;
  readonly token: number;
  readonly canJoin: boolean;
}
