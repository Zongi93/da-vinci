import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../models';
import { TableGame } from '../_table-game';
import { Actor, ComputerOpponent, Player } from './actors';
import { GamePiece, Guess, PieceColor, PieceState } from './utils';

export class GameDaVinci implements TableGame {
  static readonly MIN_PLAYER = 2;
  static readonly MAX_PLAYER = 5;
  static readonly AI_SUPPORTED = false;

  private readonly PIECE_OF_COLOR: Number;
  private readonly COLORS: Number;

  private freePieces: Array<GamePiece>;
  private readonly actors: Array<Actor>;
  private _activeActor = -1;

  private deleteMeEmitter = new Subject<void>();
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

  get publicHands$(): Observable<
    Array<{ username: string; hand: Array<GamePiece> }>
  > {
    const observables = this.actors.map(actor => {
      const username = actor.name;
      return actor.publicHand$.pipe(map(hand => ({ username, hand })));
    });
    return combineLatest(observables);
  }

  get infoMessage$(): Observable<string> {
    return this.infoEmitter.asObservable();
  }

  get deleteMe$(): Observable<void> {
    return this.deleteMeEmitter.asObservable();
  }

  static canGameStart(players: number): boolean {
    return TableGame.MIN_PLAYER <= players && TableGame.MAX_PLAYER >= players;
  }

  constructor(players: Array<User>, computerOpponentsToAdd?: Number) {
    this.PIECE_OF_COLOR = 12;
    this.COLORS = 2;

    this.initPieces();
    this.actors = players.map(user => new Player(this, user));

    if (GameDaVinci.AI_SUPPORTED && !!computerOpponentsToAdd) {
      computerOpponentsToAdd.forEach(i =>
        this.actors.push(new ComputerOpponent(this, `Computer ${i}`))
      );
    }

    this.actors.shuffle();
    this.actors.forEach(actor => actor.init());
    this.startGame();
  }

  private async givePiece(
    state: PieceState,
    giveTo: Actor,
    selectedColor?: PieceColor
  ): Promise<void> {
    if (this.freePieces.length > 0) {
      const color = !!selectedColor
        ? selectedColor
        : await giveTo.chooseAColorToTake(state);

      this.infoEmitter.next(
        `${giveTo.name} has picked a ${PieceColor[color]} piece`
      );
      const pickedPiece = this.freePieces.find(piece => piece.color === color);
      this.freePieces = this.freePieces.filter(piece => piece !== pickedPiece);

      pickedPiece.state = state;
      giveTo.takePiece(pickedPiece);
    }
  }

  private async startGame(): Promise<void> {
    const startingHandSize: Number = this.actors.length < 4 ? 4 : 3;

    for (let i = 0; i < startingHandSize; i++) {
      for (let j = 0; j < this.actors.length; j++) {
        this.infoEmitter.next(`${this.actors[j].name} is picking a color`);
        await this.givePiece(PieceState.PRIVATE, this.actors[j]);
      }
    }
    this.runGame();
  }

  private async runGame(): Promise<void> {
    while (this.aliveActors > 1) {
      const currentActor = this.nextActor;
      this.infoEmitter.next(`${currentActor.name} is making a guess`);
      let guess = await currentActor.makeAGuess();

      if (this.checkAndHandleGuess(guess)) {
        while (this.checkAndHandleGuess(guess)) {
          this.infoEmitter.next(
            `${currentActor.name} guessed correctly and gets and extra action!`
          );
          const extraAction = await currentActor.takeExtraAction();
          if (extraAction instanceof Guess) {
            guess = extraAction;
          } else {
            this.infoEmitter.next(
              `${currentActor.name} choose to take a private piece!`
            );
            await this.givePiece(PieceState.PRIVATE, currentActor, extraAction);
            break;
          }
        }
        if (!this.checkAndHandleGuess(guess)) {
          this.infoEmitter.next(
            `${
              currentActor.name
            } guessed again, but incorrectly and now is picking a color`
          );
          await this.givePiece(PieceState.PUBLIC, currentActor);
        }
      } else if (this.freePieces.length > 0) {
        this.infoEmitter.next(
          `${currentActor.name} guessed incorrectly and now is picking a color`
        );
        await this.givePiece(PieceState.PUBLIC, currentActor);
      }
    }
    this.gameOver();
  }

  private checkAndHandleGuess(guess: Guess): boolean {
    const target = this.actors.find(actor => actor.id === guess.userId);
    const guessResult = target.checkGuess(guess);
    if (guessResult) {
      target.showPiece(guess.position);
    }

    return guessResult;
  }

  private async gameOver(): Promise<void> {
    const winner = this.actors.filter(actor => actor.lifes > 0)[0];
    this.infoEmitter.next(`${winner.name} won the game! Congratulations!`);

    const promises = this.actors.map(actor => actor.gameOver());

    await Promise.all(promises);

    this.deleteMeEmitter.next();
  }

  private initPieces() {
    this.PIECE_OF_COLOR.forEach(i =>
      this.COLORS.forEach(j =>
        this.freePieces.push(new GamePiece(i, j as number))
      )
    );

    this.freePieces.shuffle();
  }
}
