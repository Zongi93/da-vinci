import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { IWebSocketController } from '../services';
import { Table } from './table';

export class User {
  get joinedTable(): Table {
    if (!!this.socketService.tableList) {
      return this.socketService.tableList.find(
        table =>
          !!table.players.find(playerName => playerName === this.userName)
      );
    } else {
      return undefined;
    }
  }

  get joinedTable$(): Observable<Table> {
    return this.socketService.tableList$.pipe(
      skip(1),
      map(tableList =>
        tableList.find(
          table =>
            !!table.players.find(playerName => playerName === this.userName)
        )
      )
    );
  }

  constructor(
    private socketService: IWebSocketController,
    public readonly userName: string
  ) {}

  static fromDto(socketService: IWebSocketController, dto: User): User {
    return new User(socketService, dto.userName.toString());
  }
}
