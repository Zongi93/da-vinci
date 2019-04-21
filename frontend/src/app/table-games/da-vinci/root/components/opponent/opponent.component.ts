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
  subscription: Subscription;

  constructor(
    private service: DavinciService,
    private socketService: IDavinciSocketService
  ) {}

  ngOnInit() {
    this.subscription = this.socketService.publicHands$
      .pipe(
        map(
          hands =>
            hands.find(update => update.userName === this.opponentName).hand
        )
      )
      .subscribe(handUpdate => (this.hand = handUpdate));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onGuess(guessValue: number, index: number): void {
    console.log(index);
    this.service.guessMade(this.opponentName, guessValue, index);
  }
}
