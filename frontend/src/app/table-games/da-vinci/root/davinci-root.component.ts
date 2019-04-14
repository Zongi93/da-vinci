import { Component, OnInit } from '@angular/core';
import { DavinciService } from './davinci.service';

@Component({
  selector: 'game-davinci-root',
  templateUrl: './davinci-root.component.html',
  styleUrls: ['./davinci-root.component.scss']
})
export class DavinciRootComponent implements OnInit {
  constructor(private service: DavinciService) {
    console.log('you are happy!');
  }

  ngOnInit() {}
}
