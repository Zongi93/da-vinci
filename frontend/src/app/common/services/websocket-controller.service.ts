import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TableGameInfo } from 'src/app/table-games';
import { Table } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketControllerService implements IWebSocketController {
  constructor(private socket: Socket) {}

  get tableList$(): Observable<Array<Table>> {
    return this.socket
      .fromEvent('table-list')
      .pipe(
        map((data: Array<Table>) => data.map(table => Table.fromDto(table)))
      );
  }

  startGame(gameInfo: TableGameInfo) {
    this.socket.emit('start-game', gameInfo.title);
    console.log('package is on the way');
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class IWebSocketController {
  abstract get tableList$(): Observable<Array<Table>>;
  abstract startGame(gameInfo: TableGameInfo);
}
