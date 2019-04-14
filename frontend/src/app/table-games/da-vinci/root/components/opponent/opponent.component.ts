import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DavinciService } from '../../davinci.service';
import { GamePiece } from '../../models';

@Component({
  selector: 'game-davinci-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss']
})
export class OpponentComponent implements OnInit {
  @Input() userName: string;
  get publicHandUpdates$(): Observable<Array<GamePiece>> {
    return this.service.getPublicHandUpdates$(this.userName);
  }

  constructor(private service: DavinciService) {}

  ngOnInit() {}
}
