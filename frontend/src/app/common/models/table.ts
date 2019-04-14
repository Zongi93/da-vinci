import { User } from 'src/app/common/models/user';

export class Table {
  readonly id: number;
  readonly players: Array<User>;
  readonly token: string;
  readonly gameTitle: string;
  readonly canJoin: boolean;

  constructor(
    id: number,
    user: Array<User>,
    token: string,
    gameTitle: string,
    canJoin: boolean
  ) {
    this.id = id;
    this.players = Array.of(...user);
    this.token = token;
    this.gameTitle = gameTitle;
    this.canJoin = canJoin;
  }

  static fromDto(dto: Table): Table {
    const players = dto.players.map(player => User.fromDto(player));
    return new Table(dto.id, players, dto.token, dto.gameTitle, dto.canJoin);
  }
}
