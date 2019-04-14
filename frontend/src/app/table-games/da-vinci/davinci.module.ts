import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  DavinciSocketService,
  IDavinciSocketService
} from './data-provider.service';
import { DavinciRoutingModule } from './davinci-routing.module';
import {
  DavinciRootComponent,
  DavinciService,
  GamePieceComponent,
  OpponentComponent,
  PlayerComponent
} from './root';

@NgModule({
  declarations: [
    DavinciRootComponent,
    OpponentComponent,
    GamePieceComponent,
    PlayerComponent
  ],
  imports: [CommonModule, DavinciRoutingModule],
  providers: [
    DavinciService,
    { provide: IDavinciSocketService, useClass: DavinciSocketService }
  ]
})
export class DavinciModule {}
