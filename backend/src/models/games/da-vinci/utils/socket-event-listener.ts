import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { User } from '../../../../models/user';

export class SocketEventListener<T> {
  private readonly emitter = new Subject<T>();

  private get socket(): Socket {
    return this.user.socket;
  }

  constructor(
    private readonly user: User,
    private readonly key: string,
    once?: boolean,
    sendPayload?: boolean,
    payload?: any
  ) {
    if (!!once && once) {
      this.once();
    } else {
      this.listen();
    }

    if (!!sendPayload && sendPayload) {
      this.socket.emit(key, payload);
    }

    user.reconnected$.pipe(delay(4000)).subscribe(() => {
      if (!!once && once) {
        this.once();
      } else {
        this.listen();
      }

      if (!!sendPayload && sendPayload) {
        this.socket.emit(key, payload);
      }
    });
  }

  asObservable(): Observable<T> {
    return this.emitter.asObservable();
  }

  toPromise(): Promise<T> {
    return this.emitter.toPromise();
  }

  private once(): void {
    this.socket.once(this.key, data => {
      console.log({ key: data });
      this.emitter.next(data as T);
      this.emitter.complete();
    });
  }

  private listen(): void {
    this.socket.on(this.key, data => this.emitter.next(data as T));
  }
}
