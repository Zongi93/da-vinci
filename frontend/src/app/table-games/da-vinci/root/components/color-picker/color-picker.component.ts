import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DavinciService } from '../../davinci.service';
import { PieceColor, PieceState } from '../../models';

@Component({
  selector: 'game-davinci-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnDestroy {
  requestedState: PieceState = undefined;

  private readonly subscription: Subscription;

  get showColorPicker() {
    return !!this.requestedState;
  }

  get colorsList(): Array<number> {
    const list = [];
    for (let i = 0; i < this.service.setupInfo.colors; i++) {
      list.push(i);
    }
    return list;
  }

  constructor(private service: DavinciService) {
    this.subscription = this.service.chooseAColorToTake$.subscribe(
      state => (this.requestedState = state)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onColorPicked(colorId: number) {
    this.requestedState = undefined;
    this.service.colorPicked(colorId);
  }

  getColorName(colorId: number): string {
    return PieceColor[colorId];
  }
}
