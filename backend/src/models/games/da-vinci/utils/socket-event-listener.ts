import { Observable, Subject } from 'rxjs';
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
    private readonly once?: boolean,
    private readonly sendPayload?: boolean,
    private readonly payload?: any
  ) {
    this.start();
  }

  asObservable(): Observable<T> {
    return this.emitter.asObservable();
  }

  toPromise(): Promise<T> {
    return this.emitter.toPromise();
  }

  start(): void {
    if (!!this.once && this.once) {
      this.listenOnce();
    } else {
      this.listen();
    }

    if (!!this.sendPayload && this.sendPayload) {
      console.log('sending ' + this.key);
      this.socket.emit(this.key, this.payload);
    }
  }

  unsubscribe(): void {
    this.emitter.unsubscribe();
  }

  private listenOnce(): void {
    this.socket.once(this.key, data => {
      console.log(`${this.user.userName} sent ${this.key}`);
      console.log(data);
      this.emitter.next(data as T);
      this.emitter.complete();
    });
  }

  private listen(): void {
    this.socket.on(this.key, data => this.emitter.next(data as T));
  }
}
