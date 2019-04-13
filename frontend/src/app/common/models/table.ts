import { User } from 'src/app/common/models/user';

let counter = 0;

export class Table {
  readonly id = counter++;
  readonly players: Array<User>;
  readonly token: string;

  constructor(user: Array<User>, token: string) {
    this.players = Array.of(...user);
    this.token = token;
  }

  static fromDto(dto: Table): Table {
    const players = dto.players.map(player => User.fromDto(player));
    return new Table(players, dto.token);
  }
}
