import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketEventListener } from '../../../../utils';
import { Player } from '../actors';

export function broadcast(
  players: Array<Player>,
  key: string,
  value: any
): void {
  const sockets = players.map(player => player.socket);
  sockets.forEach(socket => socket.emit(key, value));
}

export function listenFor<T>(
  players: Array<Player>,
  key: string
): Observable<Message<T>> {
  const playersWithSocket = players.map(player => {
    const socket = player.socket;
    return { player, socket };
  });
  const observables = playersWithSocket.map(o =>
    new SocketEventListener<T>(o.socket, key)
      .asObservable()
      .pipe(map(data => new Message<T>(o.player, data)))
  );
  return merge(...observables);
}

export class Message<T> {
  readonly sender: Player;
  readonly data: T;

  constructor(sender: Player, data: T) {
    this.sender = sender;
    this.data = data;
  }
}
