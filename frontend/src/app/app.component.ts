import { Component } from '@angular/core';
import { IAuthentication, IWebSocketController } from './common/services';
import { ListService } from './pages/list';
import { TableService } from './pages/table';

@Component({
  selector: 'common-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get username(): string {
    return this.authenticationService.user.userName;
  }

  get isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }

  constructor(
    private listService: ListService,
    private tableService: TableService,
    private authenticationService: IAuthentication,
    private webSocketService: IWebSocketController
  ) {}

  logout(): void {
    this.authenticationService.logout();
  }

  login(userName: string): void {
    this.authenticationService.login(userName);
  }
}
