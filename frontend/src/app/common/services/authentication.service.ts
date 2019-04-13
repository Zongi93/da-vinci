import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';
import { User } from '../models';
import { IRestController } from './rest-controller.service';
import { IWebSocketController } from './websocket-controller.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements IAuthentication {
  private _user: User;
  private readonly _authenticatedEmitter = new BehaviorSubject(
    this.isAuthenticated()
  );

  private set user(newValue: User) {
    this._user = newValue;
    this._authenticatedEmitter.next(this.isAuthenticated());
  }

  private get user(): User {
    return this._user;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._authenticatedEmitter.asObservable();
  }

  get loggedIn$(): Observable<void> {
    return this.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated),
      mapTo(undefined)
    );
  }

  constructor(
    private restService: IRestController,
    private socketService: IWebSocketController,
    private toastr: ToastrService
  ) {
    this.restService
      .getUser()
      .subscribe(
        userData => (this.user = userData),
        error => undefined,
        () =>
          this.toastr.success(
            'We have succesfully recovered your past session!',
            `Hello ${this._user.userName}!`
          )
      );

    this.loggedIn$.subscribe(() =>
      this.restService.pairUserToSocket().subscribe()
    );
  }

  getUserData(): User {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this._user;
  }

  login(userName: string): void {
    this.restService
      .loginUser(userName)
      .subscribe(
        userData => (this.user = userData),
        () => this.toastr.error('Login failed', 'Error!'),
        () =>
          this.toastr.success(
            'You have successfully logged in!',
            `Hello ${this._user.userName}!`
          )
      );
  }

  logout(): void {
    if (this.isAuthenticated()) {
      this.restService.logoutUser().subscribe(undefined, undefined, () => {
        this.user = undefined;
        this.toastr.warning('You have logged out!', `:(`);
      });
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class IAuthentication {
  abstract get isAuthenticated$(): Observable<boolean>;
  abstract get loggedIn$(): Observable<void>;
  abstract isAuthenticated(): boolean;
  abstract login(username: string): void;
  abstract logout(): void;
  abstract getUserData(): User;
}
