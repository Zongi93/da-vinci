import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IAuthentication, IWebSocketController } from './common/services';
import { fadeAnimation } from './fade.animation';
import { ListService } from './pages/list';
import { TableService } from './pages/table';

@Component({
  selector: 'common-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
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

  prepareRoute(outlet: RouterOutlet) {
    /* return (
      !!outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    ); */
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
