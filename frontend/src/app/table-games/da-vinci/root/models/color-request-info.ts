import { PieceColor } from './game-piece-color.enum';
import { PieceState } from './game-piece-state.enum';

export class ColorRequestEvent {
  constructor(
    public readonly state: PieceState,
    public readonly availableColors: Array<PieceColor>
  ) {}

  static fromDto(dto: ColorRequestEvent) {
    return new ColorRequestEvent(dto.state, dto.availableColors);
  }
}
