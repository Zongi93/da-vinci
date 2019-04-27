import { Component, OnInit } from '@angular/core';
import { DavinciService } from './davinci.service';

@Component({
  selector: 'game-davinci-root',
  templateUrl: './davinci-root.component.html',
  styleUrls: ['./davinci-root.component.scss'],
  providers: [DavinciService]
})
export class DavinciRootComponent implements OnInit {

  get onlyOneOpponent():boolean {
    return this.service.opponents.length < 2;
  }

  constructor(public service: DavinciService) {}

  ngOnInit() {}
}
