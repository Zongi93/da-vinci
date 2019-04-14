import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthentication } from 'src/app/common/services';
import { IDavinciSocketService } from '../../../data-provider.service';
import { DavinciService } from '../../davinci.service';
import { GamePiece } from '../../models';

@Component({
  selector: 'game-davinci-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  readonly userName: string;

  get privateHand$(): Observable<Array<GamePiece>> {
    return this.dataService.privateHand$;
  }

  constructor(
    private service: DavinciService,
    private authService: IAuthentication,
    private dataService: IDavinciSocketService
  ) {
    this.userName = authService.getUserData().userName;
  }

  ngOnInit() {}
}
