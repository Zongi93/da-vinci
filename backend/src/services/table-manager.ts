import { BehaviorSubject, Observable } from 'rxjs';
import { Table, User } from '../models';

export class TableManagerService {
  private tables: Array<Table> = [];
  private tablesEmitter = new BehaviorSubject(this.tables);

  get tables$(): Observable<Array<Table>> {
    return this.tablesEmitter.asObservable();
  }

  listTables(): Array<Table> {
    return this.tables;
  }
  createTable(user: User): void {
    this.tables.push(new Table(user));
    this.tablesEmitter.next(this.tables);
  }

  joinTable(user: User, hash: number) {
    this.findTableByHash(hash).addPlayer(user);
    this.tablesEmitter.next(this.tables);
  }

  leaveTable(user: User) {
    console.log(user);
    console.log(this.tables);
    const table = this.findTableByUser(user);
    if (!!table) {
      table.removePlayer(user);
      if (table.players.length > 0) {
        this.tablesEmitter.next(this.tables);
      } else {
        this.deleteTable(table.id);
      }
    } else {
      console.log('invalid leave request: ' + user.userName);
    }
    console.log(this.tables);
  }

  addAiToTable(user: User) {
    const joinedTable = this.findTableByUser(user);
    joinedTable.addOneAiOpponent();
    this.tablesEmitter.next(this.tables);
  }

  removeAiFromTable(user: User) {
    const joinedTable = this.findTableByUser(user);
    joinedTable.removeOneAiOpponent();
    this.tablesEmitter.next(this.tables);
  }

  startTable(user: User, gameTitle: string) {
    const tableToStart = this.findTableByUser(user);
    tableToStart
      .start(gameTitle)
      .catch(error => console.log(error))
      .finally(() => {
        console.log('table-game ended');
        this.deleteTable(tableToStart.id);
      });
    this.tablesEmitter.next(this.tables);
  }

  deleteTable(hash: number) {
    console.log('closing table');
    this.tables = this.tables.filter(table => table.id !== hash);
    this.tablesEmitter.next(this.tables);
  }

  private findTableByHash(hash: number): Table {
    return this.tables.find(table => table.id === hash);
  }

  private findTableByUser(user: User): Table {
    return this.tables.find(
      table =>
        !!table.players.find(
          joinedUser => joinedUser.userName === user.userName
        )
    );
  }
}

export const tableManagerService = new TableManagerService();
