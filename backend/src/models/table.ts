import { Observable } from 'rxjs';
import { TableGame, TableGameInfo } from './games/_table-game';
import { User, UserDto } from './user';

let counter = 0;

export class Table {
  readonly id = counter++;
  private _players: Array<User>;
  private game: TableGame = undefined;
  private gameTitleForUI: string = undefined;
  private addedAiPlayers = 0;

  get players(): Array<User> {
    return this._players;
  }

  constructor(user: User) {
    this._players = Array.of(user);
  }

  addPlayer(user: User) {
    const playerNotAlreadyAdded = !this.players.find(
      player => player.id === user.id
    );
    if (!this.game && playerNotAlreadyAdded) {
      this.players.push(user);
    }
  }

  addOneAiOpponent() {
    if (this.addedAiPlayers < 5) {
      this.addedAiPlayers++;
    }
  }

  removeOneAiOpponent() {
    if (this.addedAiPlayers > 0) {
      this.addedAiPlayers--;
    }
  }

  removePlayer(user: User) {
    if (!this.game) {
      this._players = this.players.filter(player => player.id !== user.id);
    } else {
      console.log('player cant leave a started game: ' + user.userName);
    }
  }

  async start(gameTitle: string): Promise<void> {
    this.gameTitleForUI = gameTitle;
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
          console.log('Starting Da Vinci');
          this.game = gameToStart.ctor.apply(undefined, [
            this.players,
            this.addedAiPlayers,
          ]);
          return await this.game.startGame();
      }
    }
  }

  getHash(): number {
    return this.id;
  }

  toDto(): TableDto {
    // const gameTitle = !!this.game ? this.game.gameInfo.gameTitle : undefined;
    return {
      id: this.id,
      players: this.players.map(player => player.userName),
      token: this.getHash(),
      gameTitle: this.gameTitleForUI,
      canJoin: !this.game,
      addedAis: this.addedAiPlayers,
    };
  }
}

export interface TableDto {
  readonly id: number;
  readonly players: Array<string>;
  readonly token: number;
  readonly gameTitle: string;
  readonly canJoin: boolean;
  readonly addedAis: number;
}
