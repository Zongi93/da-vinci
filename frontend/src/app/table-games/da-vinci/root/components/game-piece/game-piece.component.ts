import { Component, Input, OnInit } from '@angular/core';
import { GamePiece, PieceState } from '../../models';

@Component({
  selector: 'game-davinci-piece',
  templateUrl: './game-piece.component.html',
  styleUrls: ['./game-piece.component.scss']
})
export class GamePieceComponent implements OnInit {
  @Input() piece: GamePiece;

  constructor() {}

  ngOnInit() {}

  isShown(): boolean {
    return this.piece.state === PieceState.PUBLIC;
  }
}
