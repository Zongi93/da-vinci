import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';
import { Table } from 'src/app/common/models';
import {
  IAuthentication,
  IRestController,
  IWebSocketController
} from 'src/app/common/services';
import { TableGameInfo } from 'src/app/table-games';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  get table(): Table {
    return this.authService.user.joinedTable;
  }

  get table$(): Observable<Table> {
    return this.authService.user.joinedTable$;
  }

  constructor(
    private authService: IAuthentication,
    private socketService: IWebSocketController,
    private restService: IRestController,
    private router: Router
  ) {}

  // signals the server to start the game
  startGame(gameInfo: TableGameInfo) {
    this.restService.startTable(gameInfo).subscribe();
  }

  // launches the game if this table has a game running
  launchGame(gameInfo: TableGameInfo) {
    this.router.navigate([`/table/${gameInfo.path}`]);
  }

  addAiOpponent(): void {
    this.restService.addAiToTable().subscribe();
  }

  removeAiOpponent(): void {
    this.restService.removeAiFromTable().subscribe();
  }

  leaveTable(): void {
    this.restService.leaveTable().subscribe();
  }

  validateUrl(): Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      if (!!this.socketService.tableList) {
        return of(!!this.authService.user.joinedTable);
      } else {
        return this.socketService.tableList$.pipe(
          mapTo(!!this.authService.user.joinedTable)
        );
      }
    } else {
      return of(false);
    }
  }
}
