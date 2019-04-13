import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Guard, RouterGuardService } from './common/services';
import { ListComponent } from './pages/list';
import { NotFoundComponent } from './pages/not-found';
import { TableComponent } from './pages/table';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
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
export class AppRoutingModule {}
