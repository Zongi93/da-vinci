import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Table, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RestControllerService implements IRestController {
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>('/api/user/login').pipe(
      map((dto: any) => {
        if (!!dto.userDto) {
          return User.fromDto(dto.userDto);
        } else {
          throw Error('User has no previous session');
        }
      })
    );
  }

  loginUser(userName: string): Observable<User> {
    return this.http
      .post<User>('/api/user/login', { userName })
      .pipe(map((dto: any) => User.fromDto(dto.userDto)));
  }

  pairUserToSocket(): Observable<void> {
    return this.http.post<void>('/api/user/pair-socket', {});
  }

  logoutUser(): Observable<void> {
    return this.http.get<void>('/api/user/logout');
  }

  listTables(): Observable<Array<Table>> {
    return this.http
      .get<Array<Table>>('/api/table/list')
      .pipe(map((data: any) => data.tablesDto))
      .pipe(
        map((data: Array<Table>) => data.map(table => Table.fromDto(table)))
      );
  }

  createTable(): Observable<void> {
    return this.http.post<void>('/api/table/create', {});
  }

  joinTable(token: string): Observable<void> {
    return this.http.post<void>('/api/table/join', { token });
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class IRestController {
  abstract getUser(): Observable<User>;
  abstract loginUser(userName: string): Observable<User>;
  abstract pairUserToSocket(): Observable<void>;
  abstract logoutUser(): Observable<void>;
  abstract listTables(): Observable<Array<Table>>;
  abstract createTable(): Observable<void>;
  abstract joinTable(token: string): Observable<void>;
}
