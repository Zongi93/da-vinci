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
  constructor(
    private listService: ListService,
    private tableService: TableService,
    private authenticationService: IAuthentication,
    private webSocketService: IWebSocketController
  ) {}

  logoutUser(): void {
    this.authenticationService.logout();
  }
}
