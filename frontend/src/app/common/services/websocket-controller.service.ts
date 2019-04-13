import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Table } from '../models';
import { GamePiece } from '../models/table-games/da-vinci';

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
}

@Injectable({
  providedIn: 'root'
})
export abstract class IWebSocketController {
  abstract get tableList$(): Observable<Array<Table>>;
}
