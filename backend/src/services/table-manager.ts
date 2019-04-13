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

  startTable(hash: number) {
    const tableToStart = this.findTableByHash(hash);
    tableToStart.deleteMe$.toPromise().then(() => this.deleteTable(hash));
  }

  leaveTable(user: User, hash: number) {
    this.findTableByHash(hash).removePlayer(user);
    this.tablesEmitter.next(this.tables);
  }

  deleteTable(hash: number) {
    this.tables = this.tables.filter(table => table.id !== hash);
  }

  private findTableByHash(hash: number): Table {
    return this.tables.find(table => table.id === hash);
  }
}

export const tableManagerService = new TableManagerService();
