import { Component, Input, OnInit } from '@angular/core';
import { GamePiece, PieceColor, PieceState } from '../../models';

@Component({
  selector: 'game-davinci-piece',
  templateUrl: './game-piece.component.html',
  styleUrls: ['./game-piece.component.scss']
})
export class GamePieceComponent implements OnInit {
  @Input() piece: GamePiece;
  @Input() owner: boolean;

  get hasValue(): boolean {
    return this.piece.number !== null;
  }

  get seenByOpponent(): boolean {
    return this.owner && GamePiece.isPublic(this.piece);
  }

  constructor() {}

  ngOnInit() {}

  getColorName(colorId: number): string {
    return PieceColor[colorId];
  }
}
