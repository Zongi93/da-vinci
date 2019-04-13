import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticatedDirective } from './common/directives/authenticated.directive';
import {
  DavinciDataService,
  IDavinciDataService
} from './common/models/table-games/da-vinci';
import {
  AuthenticationService,
  IAuthentication,
  IRestController,
  IWebSocketController,
  RestControllerService,
  RouterGuardService,
  WebSocketControllerService
} from './common/services';
import { DavinciRootComponent } from './common/table-games/da-vinci/components/davinci-root.component';
import {
  ListComponent,
  ListedTableComponent,
  NewTableComponent
} from './pages/list';
import { NotFoundComponent } from './pages/not-found';
import { TableComponent } from './pages/table';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListedTableComponent,
    TableComponent,
    NotFoundComponent,
    AuthenticatedDirective,
    NewTableComponent
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    RouterGuardService,
    { provide: IAuthentication, useClass: AuthenticationService },
    { provide: IRestController, useClass: RestControllerService },
    { provide: IWebSocketController, useClass: WebSocketControllerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
