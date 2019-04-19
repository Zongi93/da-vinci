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

  private subscription: Subscription;

  constructor(
    private service: DavinciService,
    private dataService: IDavinciSocketService
  ) {}

  ngOnInit() {
    this.subscription = this.dataService.privateHand$.subscribe(
      handUpdate => (this.hand = handUpdate)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
