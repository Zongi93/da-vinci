import { Observable, Subject } from 'rxjs';
import { Socket } from 'socket.io';
import { socketManagerService } from '../services';

let counter = 0;

export class User {
  readonly id = counter++;
  readonly userName: string;

  private socketId: string = undefined;
  private reconnectEmitter = new Subject<void>();

  get reconnected$(): Observable<void> {
    return this.reconnectEmitter.asObservable();
  }

  get socket(): Socket {
    return socketManagerService.findSocketById(this.socketId);
  }

  constructor(userName: string) {
    this.userName = userName;
  }

  toDto(): UserDto {
    return { userName: this.userName };
  }

  setSocketId(socketId: string): void {
    this.socketId = socketId;
    if (!!this.socketId) {
      this.reconnectEmitter.next();
    }
  }

  releaseSocket(): void {
    this.socketId = undefined;
  }
}

export interface UserDto {
  readonly userName: string;
}
