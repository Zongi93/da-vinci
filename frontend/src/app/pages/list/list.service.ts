import { Injectable } from '@angular/core';
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
  get tableList(): Array<Table> {
    return this.socketService.tableList;
  }

  constructor(
    private authService: IAuthentication,
    private restService: IRestController,
    private socketService: IWebSocketController
  ) {}

  createTable(): void {
    this.restService.createTable().subscribe();
  }

  joinTable(tableToJoin: Table): void {
    this.restService.joinTable(tableToJoin.token).subscribe();
  }
}
