import { Observable, Subject } from 'rxjs';
import { Socket } from 'socket.io';

export class SocketEventListener<T> {
  private emitter = new Subject<T>();
  private socket: Socket;

  constructor(socket: Socket, key: string, once?: boolean) {
    this.socket = socket;
    if (!!once && once) {
      this.socket.once(key, data => this.emitter.next(data as T));
    } else {
      this.socket.on(key, data => this.emitter.next(data as T));
    }
  }

  asObservable(): Observable<T> {
    return this.emitter.asObservable();
  }

  toPromise(): Promise<T> {
    return this.emitter.toPromise();
  }
}
