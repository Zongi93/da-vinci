export class GamePiece {
  readonly number: Number;
  readonly color: PieceColor;
  readonly state: PieceState;

  constructor(number: Number, color: PieceColor, state: PieceState) {
    this.number = number;
    this.color = color;
    this.state = state;
  }

  static fromDto(dto: GamePiece): GamePiece {
    return new GamePiece(dto.number, dto.color, dto.state);
  }
}

export enum PieceColor {
  WHITE = 1,
  BLACK = 2
}

export enum PieceState {
  MISSING = 'MISSING',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}
