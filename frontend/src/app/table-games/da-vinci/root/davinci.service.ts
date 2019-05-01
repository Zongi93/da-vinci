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
  private _messages: Array<string> = [];

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
    const myName = this.authService.user.userName;
    return !this.setupInfo
      ? []
      : this.setupInfo.players.filter(name => name !== myName);
  }

  get currentPlayer(): string {
    if (this._messages.length > 0) {
      const playerNames = [this.playerName, ...this.opponents];
      const lastMessage = this._messages[this._messages.length - 1];
      return playerNames.find(name => lastMessage.includes(name));
    } else {
      return undefined;
    }
  }

  get playerName(): string {
    return this.authService.user.userName;
  }

  get winnerName(): string {
    return this._winnerName;
  }

  // TODO: display activa player
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

    this.SUBSCRIPTIONS.push(
      socketService.infoMessage$.subscribe(message =>
        this._messages.push(message)
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
