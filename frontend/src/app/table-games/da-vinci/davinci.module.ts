import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChatComponent } from './components/';
import {
  DavinciSocketService,
  IDavinciSocketService
} from './data-provider.service';
import { DavinciRoutingModule } from './davinci-routing.module';
import {
  ColorPickerComponent,
  DavinciRootComponent,
  ExtraActionPickerComponent,
  GamePieceComponent,
  OpponentComponent,
  PlayerComponent
} from './root';
import { GameOverScreenComponent } from './root/components/game-over-screen/game-over-screen.component';

@NgModule({
  declarations: [
    DavinciRootComponent,
    OpponentComponent,
    GamePieceComponent,
    PlayerComponent,
    ChatComponent,
    ColorPickerComponent,
    ExtraActionPickerComponent,
    GameOverScreenComponent
  ],
  imports: [CommonModule, DavinciRoutingModule],
  providers: [
    { provide: IDavinciSocketService, useClass: DavinciSocketService }
  ]
})
export class DavinciModule {}
