import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IDavinciSocketService } from '../../../data-provider.service';
import { DavinciService } from '../../davinci.service';
import { GamePiece } from '../../models';

@Component({
  selector: 'game-davinci-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  @Input() playerName: string;

  hand: Array<GamePiece> = [];
  private prevHand: Array<GamePiece> = [];

  private subscription: Subscription;

  get isActivePlayer(): boolean {
    return this.service.currentPlayer === this.playerName;
  }

  get isAlive(): boolean {
    return (
      this.hand.length === 0 ||
      !!this.hand.find(piece => GamePiece.isPrivate(piece))
    );
  }

  constructor(
    private service: DavinciService,
    private dataService: IDavinciSocketService
  ) {}

  ngOnInit() {
    this.subscription = this.dataService.privateHand$.subscribe(handUpdate => {
      this.prevHand = this.hand;
      this.hand = handUpdate;
    });
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
