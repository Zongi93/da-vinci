import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { tableManagerService } from './table-manager';

export class SocketManagerService {
  private _sockets: Array<Socket> = [];
  private _server: Server;

  get sockets(): Array<Socket> {
    return this._sockets.filter(socket => socket.connected);
  }

  constructor() {}

  addSocket(newSocket: Socket) {
    this._sockets.push(newSocket);
  }

  findSocketById(socketId: string): Socket {
    return this.sockets.find(socket => socket.id === socketId);
  }

  init(ioServer: Server) {
    this._server = ioServer;

    tableManagerService.tables$
      .pipe(map(tableList => tableList.map(table => table.toDto())))
      .subscribe(tableDtoList => this._server.emit('table-list', tableDtoList)); // maybe table-manager should initiate this?
  }
}

export const socketManagerService = new SocketManagerService();
