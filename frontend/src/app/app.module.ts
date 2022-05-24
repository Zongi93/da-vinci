import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { ToastrModule } from "ngx-toastr";

import { HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthenticatedDirective } from "./common/directives/authenticated.directive";

import {
  AuthenticationService,
  IAuthentication,
  IRestController,
  IWebSocketController,
  RestControllerService,
  WebSocketControllerService,
} from "./common/services";
import { RouterGuardService } from "./common/services/router-guard.service";
import {
  ListComponent,
  ListedTableComponent,
  NewTableComponent,
} from "./pages/list";
import { NotFoundComponent } from "./pages/not-found";
import { ListedGameComponent, TableComponent } from "./pages/table";

const config: SocketIoConfig = {
  url: `http://${window.location.hostname}:3000`,
  options: {},
};

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListedTableComponent,
    TableComponent,
    NotFoundComponent,
    AuthenticatedDirective,
    NewTableComponent,
    ListedGameComponent,
  ],
  imports: [
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    RouterGuardService,
    { provide: IAuthentication, useClass: AuthenticationService },
    { provide: IRestController, useClass: RestControllerService },
    { provide: IWebSocketController, useClass: WebSocketControllerService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
