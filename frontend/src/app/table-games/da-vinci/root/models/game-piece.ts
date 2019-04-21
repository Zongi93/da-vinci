import { PieceColor } from './game-piece-color.enum';
import { PieceState } from './game-piece-state.enum';

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
    return new GamePiece(dto.number, dto.color, dto['_state']);
  }

  static isMissing(piece: GamePiece): boolean {
    return piece.state === PieceState.MISSING;
  }

  static isPrivate(piece: GamePiece): boolean {
    return piece.state === PieceState.PRIVATE;
  }

  static isPublic(piece: GamePiece): boolean {
    return piece.state === PieceState.PUBLIC;
  }
}
