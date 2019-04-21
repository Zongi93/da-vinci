import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IAuthentication, IWebSocketController } from './common/services';
import {
  Guard,
  RouterGuardService
} from './common/services/router-guard.service';
import { ListComponent } from './pages/list';
import { NotFoundComponent } from './pages/not-found';
import { TableComponent } from './pages/table';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'table/da-vinci',
    loadChildren: './table-games/da-vinci/davinci.module#DavinciModule',
    canActivate: [RouterGuardService],
    data: [Guard.AUTHENTICATED, Guard.AT_TABLE],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'table',
    component: TableComponent,
    canActivate: [RouterGuardService],
    data: [Guard.AUTHENTICATED, Guard.AT_TABLE],
    runGuardsAndResolvers: 'always'
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private socketService: IWebSocketController,
    private authService: IAuthentication,
    private router: Router
  ) {
    combineLatest(socketService.tableList$, authService.loggedIn$)
      .pipe(
        filter(() => authService.isAuthenticated()),
        filter(() => !!authService.user.joinedTable),
        filter(() => !router.url.includes('/table')) // some better method to avoid 'refreshing' would be nice
      )
      .subscribe(() => {
        router.navigate(['/table']);
      });

    combineLatest(socketService.tableList$, authService.loggedIn$)
      .pipe(
        filter(() => authService.isAuthenticated()),
        filter(() => !authService.user.joinedTable),
        filter(() => !router.url.includes('/list'))
      )
      .subscribe(() => {
        router.navigate(['/list']);
      });

    socketService.serverRestart$.subscribe(() => window.location.reload());
  }
}
