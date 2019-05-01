import { PieceColor } from './game-piece-color.enum';
import { PieceState } from './game-piece-state.enum';

export class GamePiece {
  constructor(
    public readonly number: Number,
    public readonly color: PieceColor,
    public readonly state: PieceState,
    public readonly id: number
  ) {}

  static fromDto(dto: GamePiece): GamePiece {
    return new GamePiece(dto.number, dto.color, dto.state, dto.id);
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
