import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DavinciRootComponent, DavinciService } from './components';
import {
  DavinciDataService,
  IDavinciDataService
} from './data-provider.service';
import { DavinciRoutingModule } from './davinci-routing.module';

@NgModule({
  declarations: [DavinciRootComponent],
  imports: [CommonModule, DavinciRoutingModule],
  providers: [
    DavinciService,
    { provide: IDavinciDataService, useClass: DavinciDataService }
  ]
})
export class DavinciModule {}
