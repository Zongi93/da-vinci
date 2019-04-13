import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Table } from 'src/app/common/models';
import {
  IAuthentication,
  IRestController,
  IWebSocketController
} from 'src/app/common/services';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private _tables: Array<Table> = [];

  get TableList(): Array<Table> {
    return this._tables;
  }

  private set tables(value: Array<Table>) {
    this._tables = value;
    this.checkIfUserInGame();
  }

  constructor(
    private authService: IAuthentication,
    private restService: IRestController,
    private socketService: IWebSocketController,
    private router: Router
  ) {
    this.socketService.tableList$.subscribe(tables => (this.tables = tables));

    this.authService.loggedIn$
      .pipe(filter(() => this._tables.length > 0))
      .subscribe(() => this.checkIfUserInGame());
  }

  login(userName: string) {
    this.authService.login(userName);
  }

  createTable(): void {
    this.restService.createTable().subscribe();
  }

  joinTable(tableToJoin: Table): void {
    this.restService.joinTable(tableToJoin.token).subscribe();
  }

  private checkIfUserInGame(): void {
    if (this.authService.isAuthenticated()) {
      const myUserName = this.authService.getUserData().userName;
      const joinedTable = this._tables.find(
        table => !!table.players.find(player => player.userName === myUserName)
      );
      if (!!joinedTable) {
        const token = joinedTable.token;
        this.router.navigate(['/table'], {
          queryParams: { token }
        });
      }
    }
  }
}
