import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DavinciService } from '../../davinci.service';
import { GamePiece, PieceColor, PieceState } from '../../models';

@Component({
  selector: 'game-davinci-piece',
  templateUrl: './game-piece.component.html',
  styleUrls: ['./game-piece.component.scss']
})
export class GamePieceComponent implements OnInit {
  @Input() piece: GamePiece;
  @Input() isNew = true;
  @Input() wasJustFlipped = false;
  @Input() index: number;
  @Input() playerOwned: boolean;
  @Output() guess = new EventEmitter<number>();

  guessValue = 0;

  get hasValue(): boolean {
    return this.piece.number !== null;
  }

  get isPublic(): boolean {
    return GamePiece.isPublic(this.piece);
  }

  get seenByOpponent(): boolean {
    return this.playerOwned && this.isPublic;
  }

  get guessRequested(): boolean {
    return this.service.guessRequested;
  }

  constructor(private service: DavinciService) {}

  ngOnInit() {
    this.playerOwned = this.playerOwned !== undefined;
  }

  getColorName(colorId: number): string {
    return PieceColor[colorId];
  }

  incrementGuess(): void {
    this.guessValue++;
    if (this.guessValue >= this.service.setupInfo.piecePerColor) {
      this.guessValue = 0;
    }
  }

  decrementGuess(): void {
    this.guessValue--;
    if (this.guessValue < 0) {
      this.guessValue = this.service.setupInfo.piecePerColor - 1;
    }
  }

  onMouseWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.incrementGuess();
    } else {
      this.decrementGuess();
    }
  }

  confirmGuess(): void {
    if (this.guessRequested) {
      this.guess.emit(this.guessValue);
    }
  }
}
