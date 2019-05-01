import { GamePiece } from './game-piece';

export class Hand {
  private _hand: Array<GamePiece> = [];

  get hand() {
    return this._hand;
  }
  constructor(public readonly userName: string, hand: Array<GamePiece>) {
    this._hand = hand;
  }

  toDto() {
    return {
      userName: this.userName,
      hand: this.hand.map(piece => piece.toDto()),
    };
  }
}
