import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Table } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketControllerService implements IWebSocketController {
  private tableListEmitter = new BehaviorSubject<Array<Table>>(undefined);

  constructor(private socket: Socket) {
    socket.on('table-list', (tablesDto: Array<Table>) =>
      this.tableListEmitter.next(
        tablesDto.map(tableDto => Table.fromDto(tableDto))
      )
    );
  }

  get tableList$(): Observable<Array<Table>> {
    return this.tableListEmitter.asObservable();
  }

  get tableList(): Array<Table> {
    return this.tableListEmitter.value;
  }

  get serverRestart$(): Observable<void> {
    return this.socket.fromEvent('server-start');
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class IWebSocketController {
  abstract get tableList$(): Observable<Array<Table>>;
  abstract get tableList(): Array<Table>;
  abstract get serverRestart$(): Observable<void>;
}
