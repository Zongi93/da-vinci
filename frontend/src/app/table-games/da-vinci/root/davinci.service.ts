import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDavinciSocketService } from '../data-provider.service';
import { GamePiece } from './models';

@Injectable()
export class DavinciService {
  constructor(private dataService: IDavinciSocketService) {}

  getPublicHandUpdates$(userName: string): Observable<Array<GamePiece>> {
    return this.dataService.publicHands$.pipe(
      map(hands => hands.find(update => update.userName === userName).hand)
    );
  }
}
