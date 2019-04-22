export class Table {
  readonly players: Array<string>;

  constructor(
    public readonly id: number,
    users: Array<string>,
    public readonly token: string,
    public readonly gameTitle: string,
    public readonly canJoin: boolean,
    public readonly addedAis: number
  ) {
    this.players = Array.of(...users);
  }

  static fromDto(dto: Table): Table {
    return new Table(
      dto.id,
      dto.players,
      dto.token,
      dto.gameTitle,
      dto.canJoin,
      Number(dto.addedAis)
    );
  }
}
