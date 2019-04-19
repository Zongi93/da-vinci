import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthentication } from 'src/app/common/services';
import { IDavinciSocketService, SetupInfo } from '../data-provider.service';
import { GamePiece, PieceState } from './models';

@Injectable()
export class DavinciService {
  private _setupInfo: SetupInfo;

  get chooseAColorToTake$(): Observable<PieceState> {
    return this.socketService.chooseAColorToTake$;
  }

  get setupInfo(): SetupInfo {
    return this._setupInfo;
  }

  get opponents(): Array<string> {
    return this.authService.user.joinedTable.players.filter(
      playerName => playerName !== this.playerName
    );
  }

  get playerName(): string {
    return this.authService.user.userName;
  }

  constructor(
    private socketService: IDavinciSocketService,
    private authService: IAuthentication
  ) {
    console.log('hello');
    socketService.gameSetup$.subscribe(
      setupInfo => (this._setupInfo = setupInfo)
    );
  }

  colorPicked(colorId: number) {
    this.socketService.sendSelectedColor(colorId);
  }
}
