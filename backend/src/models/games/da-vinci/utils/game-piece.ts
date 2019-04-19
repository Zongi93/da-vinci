import { InvalidPlayError } from './errors';

export class GamePiece {
  readonly number: Number;
  readonly color: PieceColor;
  private _state: PieceState;

  get state(): PieceState {
    return this._state;
  }

  set state(newValue: PieceState) {
    if (
      (newValue === PieceState.PRIVATE && GamePiece.isMissing(this)) ||
      (newValue === PieceState.PUBLIC &&
        (GamePiece.isMissing(this) || GamePiece.isPrivate(this)))
    ) {
      this._state = newValue;
    } else {
      throw new InvalidPlayError(
        `Invalid PieceState change: ${this._state} -> ${newValue}`
      );
    }
  }

  constructor(number: Number, color: PieceColor, state?: PieceState) {
    this.number = number;
    this.color = color;

    if (!!state) {
      this._state = state;
    } else {
      this._state = PieceState.MISSING;
    }
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

  static compare(left: GamePiece, right: GamePiece) {
    if (left.number !== right.number) {
      return left.number > right.number ? 1 : -1;
    } else {
      return left.color > right.color ? 1 : -1;
    }
  }

  static hide(piece: GamePiece): GamePiece {
    return new GamePiece(Number.NaN, piece.color, PieceState.PRIVATE);
  }
}

export enum PieceColor {
  WHITE = 0,
  BLACK = 1,
}

export enum PieceState {
  MISSING = 'MISSING',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}
