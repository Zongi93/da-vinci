import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDavinciSocketService } from '../../../data-provider.service';
import { DavinciService } from '../../davinci.service';
import { GamePiece } from '../../models';

@Component({
  selector: 'game-davinci-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss']
})
export class OpponentComponent implements OnInit, OnDestroy {
  @Input() opponentName: string;

  hand: Array<GamePiece> = [];
  private prevHand: Array<GamePiece> = [];
  subscription: Subscription;

  get isActivePlayer(): boolean {
    return this.service.currentPlayer === this.opponentName;
  }

  get isAlive(): boolean {
    return (
      this.hand.length === 0 ||
      !!this.hand.find(piece => GamePiece.isPrivate(piece))
    );
  }

  constructor(
    private service: DavinciService,
    private socketService: IDavinciSocketService
  ) {}

  // TODO: change background when dead

  ngOnInit() {
    this.subscription = this.socketService.publicHands$
      .pipe(
        map(
          hands =>
            hands.find(update => update.userName === this.opponentName).hand
        )
      )
      .subscribe(handUpdate => {
        this.prevHand = this.hand;
        this.hand = handUpdate;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackBy(index: number, piece: GamePiece) {
    return !!piece ? piece.id : undefined;
  }

  isPieceNew(piece: GamePiece): boolean {
    return !this.prevHand.find(prev => prev.id === piece.id);
  }

  wasJustFlipped(piece: GamePiece): boolean {
    const old = this.prevHand.find(prev => piece.id === prev.id);
    const current = this.hand.find(curr => piece.id === curr.id);

    return (
      !!old &&
      !!current &&
      GamePiece.isPrivate(old) &&
      GamePiece.isPublic(current)
    );
  }

  onGuess(guessValue: number, index: number): void {
    this.service.guessMade(this.opponentName, guessValue, index);
  }
}
