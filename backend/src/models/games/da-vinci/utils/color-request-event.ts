import { PieceColor, PieceState } from './game-piece';

export class ColorRequestEvent {
  constructor(
    public readonly state: PieceState,
    public readonly availableColors: Array<PieceColor>
  ) {}
}
