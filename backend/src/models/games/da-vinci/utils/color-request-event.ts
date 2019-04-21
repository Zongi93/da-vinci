import { PieceColor, PieceState } from './game-piece';

export class ColorRequestEvent {
  constructor(
    private readonly state: PieceState,
    private readonly availableColors: Array<PieceColor>
  ) {}
}
