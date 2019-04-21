import { Component, OnInit } from '@angular/core';
import { DavinciService } from '../../davinci.service';
import { GameAction } from '../../models';

@Component({
  selector: 'game-davinci-extra-action-picker',
  templateUrl: './extra-action-picker.component.html',
  styleUrls: ['./extra-action-picker.component.scss']
})
export class ExtraActionPickerComponent implements OnInit {
  get showExtraActionPicker(): boolean {
    return !!this.service.extraActionInfo;
  }

  get availableExtraActions(): Array<GameAction> {
    return this.service.extraActionInfo;
  }

  constructor(private service: DavinciService) {}

  ngOnInit() {}

  takeAnotherGuess() {
    this.service.extraActionPicked(GameAction.GUESS); // who's back
  }

  takeExtraPiece() {
    this.service.extraActionPicked(GameAction.PICK); // again
  }

  endTurn() {
    this.service.extraActionPicked(GameAction.STOP); // tell a friend
  }

  isAvailable(action: GameAction): boolean {
    return this.availableExtraActions.includes(action);
  }
}
