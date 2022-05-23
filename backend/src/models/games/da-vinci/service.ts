import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../models';
import { TableGame, TableGameInfo } from '../_table-game';
import { Actor, ComputerOpponent, Player } from './actors';
import { GamePiece, Guess, Hand, PieceColor, PieceState } from './utils';
import { ColorRequestEvent } from './utils/color-request-event';
import { GameAction } from './utils/extra-action.enum';

export class GameDaVinci implements TableGame {
  static get INFO(): TableGameInfo {
    return new TableGameInfo(
      'Da Vinci',
      2,
      5,
      true,
      (players: Array<User>, computerOpponentsToAdd?: Number) =>
        new GameDaVinci(players, computerOpponentsToAdd)
    );
  }
  // TODO: INFO FOR PLAYERS ABOUT GUESSSES
  readonly PIECE_PER_COLOR: Number;
  readonly COLORS: Number;

  private freePieces: Array<GamePiece> = [];
  private readonly actors: Array<Actor> = [];
  private _activeActor = -1;

  private infoEmitter = new Subject<string>();

  private get aliveActors(): Number {
    return this.actors.filter(actor => actor.lifes > 0).length;
  }

  private get nextActor(): Actor {
    do {
      this._activeActor++;
      this._activeActor = this._activeActor % this.actors.length;
    } while (this.actors[this._activeActor].lifes === 0);
    return this.actors[this._activeActor];
  }

  get gameInfo(): TableGameInfo {
    return GameDaVinci.INFO;
  }

  get gameSetup() {
    return {
      colors: this.COLORS,
      piecePerColor: this.PIECE_PER_COLOR,
      players: this.actors.map(actor => actor.name),
    };
  }

  get publicHands$(): Observable<Array<Hand>> {
    const observables = this.actors.map(actor =>
      actor.publicHand$.pipe(map(hand => new Hand(actor.name, hand)))
    );
    return combineLatest(observables);
  }

  get infoMessage$(): Observable<string> {
    return this.infoEmitter.asObservable();
  }

  constructor(players: Array<User>, computerOpponentsToAdd?: Number) {
    console.log('ai to add: ' + computerOpponentsToAdd);
    this.PIECE_PER_COLOR = Number(12);
    this.COLORS = Number(2);

    this.initPieces();
    this.actors = players.map(user => new Player(this, user));

    if (GameDaVinci.INFO.aiSupported && !!computerOpponentsToAdd) {
      for (let i = 0; i < computerOpponentsToAdd; i++) {
        this.actors.push(new ComputerOpponent(this, `Computer ${i}`));
      }
    }

    this.actors = this.actors.shuffle();
    console.log('game constructed');
  }

  public async startGame(): Promise<void> {
    if (this.gameInfo.canGameStart(this.actors.length) === false) {
      throw new Error('Game starting conditions are not met.');
    }
    console.log(this);
    console.log('game started');
    const actorsReady = this.actors.map(actor => actor.init());
    await Promise.all(actorsReady);
    console.log('waiting done');
    const startingHandSize: Number = this.actors.length < 4 ? 4 : 3;

    for (let i = 0; i < startingHandSize; i++) {
      for (let j = 0; j < this.actors.length; j++) {
        this.infoEmitter.next(`${this.actors[j].name} is picking a color.`);
        await this.givePiece(PieceState.PRIVATE, this.actors[j]);
      }
    }
    return await this.runGame();
  }

  private async givePiece(state: PieceState, giveTo: Actor): Promise<void> {
    if (this.freePieces.length > 0) {
      let color: PieceColor;

      if (this.getAvailableColors().length > 1) {
        const colorRequest = new ColorRequestEvent(
          state,
          this.getAvailableColors()
        );
        color = await giveTo.chooseAColorToTake(colorRequest);
        this.infoEmitter.next(
          `${giveTo.name} has picked a ${PieceColor[color]} piece.`
        );
      } else {
        color = this.getAvailableColors()[0];
        this.infoEmitter.next(
          `${giveTo.name} was given a ${
            PieceColor[color]
          } piece as there is no other color left.`
        );
      }

      const pickedPiece = this.freePieces.find(piece => piece.color === color);
      this.freePieces = this.freePieces.filter(piece => piece !== pickedPiece);

      pickedPiece.state = state;
      giveTo.takePiece(pickedPiece);
    } else {
      this.infoEmitter.next(
        `${giveTo.name} can't take a piece as there is none left.`
      );
    }
  }

  private async runGame(): Promise<void> {
    while (this.aliveActors > 1) {
      const currentActor = this.nextActor;
      await this.takeTurn(currentActor);
    }
    return await this.gameOver();
  }

  private async gameOver(): Promise<void> {
    const winner = this.actors.filter(actor => actor.lifes > 0)[0];
    this.infoEmitter.next(`${winner.name} won the game! Congratulations.`);

    const promises = this.actors.map(actor => actor.gameOver(winner.name));

    await Promise.all(promises);

    return Promise.resolve();
  }

  private getAvailableColors(): Array<PieceColor> {
    return this.freePieces
      .map(piece => piece.color)
      .sort()
      .filter((val, i, arr) => i === 0 || arr[i - 1] !== val);
  }

  private getAvailableActions(): Array<GameAction> {
    const result = [GameAction.GUESS];
    if (this.freePieces.length > 0) {
      result.push(GameAction.PICK);
    } else {
      result.push(GameAction.STOP);
    }

    return result;
  }

  private checkAndHandleGuess(guess: Guess): boolean {
    const target = this.actors.find(actor => actor.name === guess.userName);
    const guessResult = target.checkGuess(guess);
    if (guessResult) {
      target.showPiece(guess.position);
    }

    return guessResult;
  }

  private initPieces() {
    for (let i = 0; i < this.PIECE_PER_COLOR; i++) {
      for (let j = 0; j < this.COLORS; j++) {
        this.freePieces.push(new GamePiece(i, j as number));
      }
    }

    this.freePieces = this.freePieces.shuffle();
  }

  private async takeTurn(currentActor: Actor): Promise<void> {
    let nextAction = GameAction.GUESS;
    let lastGuessResultIsCorrect;
    while (true) {
      switch (nextAction) {
        case GameAction.GUESS:
          this.infoEmitter.next(`${currentActor.name} is guessing.`);
          const guess = await currentActor.makeAGuess();
          lastGuessResultIsCorrect = this.checkAndHandleGuess(guess);
          if (lastGuessResultIsCorrect) {
            if (this.aliveActors === 1) {
              return;
            }
            this.infoEmitter.next(
              `${currentActor.name} guessed correctly and gets an extra action.`
            );
            nextAction = await currentActor.chooseExtraAction(
              this.getAvailableActions()
            );
            this.relayChoice(nextAction, currentActor);
            break;
          }
        // falltrough
        case GameAction.PICK:
          const state = lastGuessResultIsCorrect
            ? PieceState.PRIVATE
            : PieceState.PUBLIC;
          if (!lastGuessResultIsCorrect) {
            this.infoEmitter.next(
              `${
                currentActor.name
              } guessed incorrectly and now is picking a color.`
            );
          }
          await this.givePiece(state, currentActor);
        // fallthrough
        case GameAction.STOP:
          return;
      }
    }
  }

  private relayChoice(extraAction: GameAction, currentActor: Actor) {
    switch (extraAction) {
      case GameAction.GUESS:
        this.infoEmitter.next(
          `${currentActor.name} choose to continue guessing.`
        );
        break;
      case GameAction.PICK:
        this.infoEmitter.next(
          `${
            currentActor.name
          } choose to stop guessing and now is picking a color.`
        );
        break;
      case GameAction.STOP:
        this.infoEmitter.next(
          `${
            currentActor.name
          } choose to stop guessing but won't get a piece as there is none left.`
        );
        break;
    }
  }
}
