import { InvalidPlayError } from './errors';

export class GamePiece {
  private static counter = 0;
  readonly number: Number;
  readonly color: PieceColor;
  private _state: PieceState;
  private _id: number = undefined;

  get state(): PieceState {
    return this._state;
  }

  set state(newValue: PieceState) {
    if (
      (newValue === PieceState.PRIVATE && GamePiece.isMissing(this)) ||
      (newValue === PieceState.PUBLIC &&
        (GamePiece.isMissing(this) || GamePiece.isPrivate(this)))
    ) {
      if (GamePiece.isMissing(this) && !this._id) {
        this._id = GamePiece.counter++;
      }
      this._state = newValue;
    } else {
      throw new InvalidPlayError(
        `Invalid PieceState change: ${this._state} -> ${newValue}`
      );
    }
  }

  get id(): number {
    return this._id;
  }

  constructor(
    number: Number,
    color: PieceColor,
    state?: PieceState,
    id?: number
  ) {
    this.number = number;
    this.color = color;
    this._id = id;

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
    return new GamePiece(Number.NaN, piece.color, PieceState.PRIVATE, piece.id);
  }

  toDto() {
    return {
      number: this.number,
      color: this.color,
      state: this.state,
      id: this._id,
    };
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
