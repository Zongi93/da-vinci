import { User } from 'src/app/common/models/user';

export class Table {
  readonly id: number;
  readonly players: Array<string>;
  readonly token: string;
  readonly gameTitle: string;
  readonly canJoin: boolean;

  constructor(
    id: number,
    users: Array<string>,
    token: string,
    gameTitle: string,
    canJoin: boolean
  ) {
    this.id = id;
    this.players = Array.of(...users);
    this.token = token;
    this.gameTitle = gameTitle;
    this.canJoin = canJoin;
  }

  static fromDto(dto: Table): Table {
    return new Table(
      dto.id,
      dto.players,
      dto.token,
      dto.gameTitle,
      dto.canJoin
    );
  }
}
