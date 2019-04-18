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
    data: [Guard.AUTHENTICATED, Guard.HAS_ACCESS_TOKEN]
  },
  {
    path: 'table',
    component: TableComponent,
    canActivate: [RouterGuardService],
    data: [Guard.AUTHENTICATED, Guard.HAS_ACCESS_TOKEN],
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
        filter(() => !!authService.user.joinedTable)
      )
      .subscribe(() => {
        router.navigate(['/table']);
      });
  }
}
