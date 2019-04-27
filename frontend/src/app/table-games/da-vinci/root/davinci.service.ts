import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAuthentication } from 'src/app/common/services';
import { IDavinciSocketService, SetupInfo } from '../data-provider.service';
import { GameAction, Guess } from './models';
import { ColorRequestEvent } from './models/color-request-info';

@Injectable()
export class DavinciService implements OnDestroy {
  private _setupInfo: SetupInfo;
  private _colorRequestInfo: ColorRequestEvent = undefined;
  private _guessRequested = false;
  private _extraActionRequested = undefined;
  private _winnerName: string = undefined;

  get setupInfo(): SetupInfo {
    return this._setupInfo;
  }

  get guessRequested(): boolean {
    return this._guessRequested;
  }

  get colorRequestInfo(): ColorRequestEvent {
    return this._colorRequestInfo;
  }

  get extraActionInfo(): Array<GameAction> {
    return this._extraActionRequested;
  }

  get opponents(): Array<string> {
    return this.authService.user.joinedTable.players.filter(
      playerName => playerName !== this.playerName
    );
  }

  get playerName(): string {
    return this.authService.user.userName;
  }

  get winnerName(): string {
    return this._winnerName;
  }

  // TODO: play sound when action required
  // TODO: show toasts when action required

  private readonly SUBSCRIPTIONS: Array<Subscription> = [];

  constructor(
    private socketService: IDavinciSocketService,
    private authService: IAuthentication
  ) {
    this.SUBSCRIPTIONS.push(
      socketService.gameSetup$.subscribe(
        setupInfo => (this._setupInfo = setupInfo)
      )
    );
    this.SUBSCRIPTIONS.push(
      socketService.makeAGuess$.subscribe(() => (this._guessRequested = true))
    );

    this.SUBSCRIPTIONS.push(
      socketService.chooseAColorToTake$.subscribe(
        request => (this._colorRequestInfo = request)
      )
    );

    this.SUBSCRIPTIONS.push(
      socketService.chooseExtraAction$.subscribe(
        actions => (this._extraActionRequested = actions)
      )
    );

    this.SUBSCRIPTIONS.push(
      socketService.gameOver$.subscribe(
        winnerName => (this._winnerName = winnerName)
      )
    );
  }

  ngOnDestroy() {
    this.SUBSCRIPTIONS.forEach(subscription => subscription.unsubscribe());
  }

  colorPicked(colorId: number) {
    this._colorRequestInfo = undefined;
    this.socketService.sendSelectedColor(colorId);
  }

  guessMade(username: string, guessValue: number, guessIndex: number) {
    this._guessRequested = false;
    const guess = new Guess(username, guessIndex, guessValue);
    this.socketService.sendGuess(guess);
  }

  extraActionPicked(choice: GameAction): void {
    this._extraActionRequested = undefined;
    this.socketService.sendExtraActionChoice(choice);
  }

  gameOverAcknowledged(): void {
    this._winnerName = undefined;
    this.socketService.acknowledgeGameOver();
  }
}
