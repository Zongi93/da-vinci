import { Component } from '@angular/core';
import { DavinciService } from '../../davinci.service';
import { PieceColor } from '../../models';
import { ColorRequestEvent } from '../../models/color-request-info';

@Component({
  selector: 'game-davinci-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  get requestInfo(): ColorRequestEvent {
    return this.service.colorRequestInfo;
  }

  get showColorPicker() {
    return !!this.service.colorRequestInfo;
  }

  get colorsList(): Array<number> {
    return this.requestInfo.availableColors;
  }

  constructor(private service: DavinciService) {}

  onColorPicked(colorId: number) {
    this.service.colorPicked(colorId);
  }

  getColorName(colorId: number): string {
    return PieceColor[colorId];
  }
}
